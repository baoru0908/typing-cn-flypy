/*
 * 主题色板提取：从主题 CSS 里读真实的语义变量，供主题选择器做预览。
 *
 * 为什么不能直接用 themes/config.ts 的 bgColor / textColor：
 * 那两字段只覆盖底色与正文色，而打字界面真正在用的是
 * --primary-color（打对）、--error-color（打错）、--success-color、
 * --monkey-caret-color（光标）、--home-window-bg-color（面板，常带透明度）。
 * 用静态两字段画预览，40 套主题会长得几乎一样，选色失去依据。
 *
 * 做法：主题面板打开时一次性 fetch 全部主题 CSS 文本，抽出其中 :root 块的
 * 声明体，注入一个离屏 <style>——default 统一写成 :where(.tp-host)，其余主题
 * 写成 .tp-host[data-t="<key>"]。同文件靠特异性分层：基座 (0,0,0) 无条件命中，
 * 主题 (0,2,0) 只命中被预览的那套，因此既能让目标主题盖过基座，
 * 又能让基座补上该主题没声明的变量，复现真实页面的层叠结果。
 * 探针 display:none，不参与布局；单文件版下主题已内嵌，不发任何请求。
 */

import { contrastRatio, isColorClash, isLightColor } from '@/utils/color';

export interface ThemePalette {
    /** 页面底色（--bg-color，不透明）——卡片最直观的区分色 */
    bg: string;
    /** 打字区面板色（--ui-surface，真实界面实际用的变量） */
    panel: string;
    /** 正文色 */
    text: string;
    /** 次级文字（--home-window-text-sub-color，可能带透明度） */
    sub: string;
    /** 强调色 = 打对（撞色主题下已退回正文色） */
    primary: string;
    /** 错误色 = 打错 */
    error: string;
    /** 成功色，缺省时回落强调色 */
    success: string;
    /** 光标色 */
    caret: string;
    /** 当前字底色（--home-input-focus-color，带透明度） */
    current: string;
    /** 主题名用色：正文色对比不足时兜底成黑/白，保证名字可读 */
    nameText: string;
}

/** 主题名 → CSS 文件名（与 themes/index.ts 的 themeKey 规则一致） */
export const themeCssKey = (name: string) => name.replace(/ /g, '-');

/** default 主题的 CSS 键：作为探针基座，提供未声明变量的兜底值 */
const DEFAULT_KEY = 'default';

/** 探针宿主类名；主题规则用 :where(.tp-host[data-t=...]) 挂上去 */
const PROBE_HOST = '.tp-host';

/** 单文件版：pack-single.js 把全部主题塞进 window.__THEMES__（键为 css 文件名） */
const embeddedThemes = (): Record<string, string> => (window as any).__THEMES__ || {};

/**
 * 抽出主题 CSS 里所有 :root { ... } 块的声明体。
 *
 * 为什么不能把整个文件直接塞进选择器：主题文件的变量都在 :root 里，
 * 写成 .tp-host[data-t=K]{ :root{...} } 是嵌套规则，普通 CSS 不支持，
 * 浏览器整条丢弃——探针一个变量都拿不到，只能沿 DOM 继承 <html> 上
 * 当前生效主题的值，39 张卡片全部显示同一个颜色（线上真实踩过）。
 * 所以必须把 :root 的声明体剥出来，直接挂到探针选择器下。
 */
function rootDecls(css: string): string {
    const out: string[] = [];
    const re = /(^|[\s,}]):root\b\s*\{/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(css))) {
        let i = m.index + m[0].length;
        let depth = 1;
        const start = i;
        while (i < css.length && depth > 0) {
            const ch = css[i];
            if (ch === '{') depth++;
            else if (ch === '}') depth--;
            i++;
        }
        if (depth === 0) out.push(css.slice(start, i - 1));
    }
    return out.join('\n');
}

/** 已拿到的 CSS 文本：key → 文本 */
const cssText = new Map<string, string>();

let injected: HTMLStyleElement | null = null;
let probe: HTMLDivElement | null = null;

/**
 * 把全部主题 CSS 拼成一张离屏表；返回是否至少注入了一套。
 *
 * 选择器分两层，刻意拉开特异性：
 *   default 基座  :where(.tp-host)             → 特异性 (0,0,0)，无条件命中
 *   各主题覆盖    .tp-host[data-t="<key>"]     → 特异性 (0,2,0)，只命中被预览的那套
 *
 * 两个坑都踩过，说明一下为什么必须这么写：
 * 1. 基座不能也写成带 data-t 的形式。探针设 data-t="ph-yellow" 时，
 *    data-t="default" 那条不命中，兜底值一个都进不来；未声明的变量会沿
 *    DOM 父链去读 <html> 上当前生效主题的值——于是 ph-yellow 的卡片会
 *    显示 nord 的 --error-color（若用户正用 nord），颜色跟着"当前选中的
 *    主题"跑，而不是跟着被预览的主题跑。
 * 2. 主题规则不能套 :where()。:where() 内部不计特异性，:where(.tp-host)
 *    与 :where(.tp-host[data-t=K]) 都是 (0,0,0)，同特异性靠源序决胜，
 *    default 写在前面就会永远赢，主题被压死。
 *    所以主题用裸的 .tp-host[data-t=K]（0,2,0），严格压过基座。
 */
function injectAll(): boolean {
    if (injected) return true;
    if (cssText.size === 0) return false;

    // default 排最前当基座：无条件命中，被各主题规则按特异性压过。
    // 只注入 :root 的声明体，整份文件直接塞会变成非法嵌套规则被浏览器丢弃。
    // 末尾补 --ui-surface（打字区真实面板色，tokens 在 :root 用 color-mix 定义，
    // 主题文件没有）——必须在探针元素上用该主题自己的 bg/head-text 现算，
    // 否则沿 DOM 继承到的是「当前生效主题」的表面色
    const base = rootDecls(cssText.get(DEFAULT_KEY) || '');
    const surfaceDecl =
        '--ui-surface: color-mix(in srgb, var(--head-text-color) 5%, var(--bg-color));';
    const parts: string[] = [`:where(${PROBE_HOST}){${base}\n${surfaceDecl}}`];
    cssText.forEach((css, key) => {
        if (key === DEFAULT_KEY) return;
        const decls = rootDecls(css);
        if (!decls) return;
        parts.push(`${PROBE_HOST}[data-t="${key}"]{${decls}}`);
    });

    const style = document.createElement('style');
    style.id = 'theme-palette-style';
    style.textContent = parts.join('\n');
    document.head.appendChild(style);
    injected = style;

    const host = document.createElement('div');
    host.className = 'tp-host';
    host.id = 'theme-palette-probe';
    host.style.display = 'none';
    document.body.appendChild(host);
    probe = host;
    return true;
}

/**
 * 预加载全部主题的 CSS 文本。
 * 单文件版直接读 window.__THEMES__；否则并发 fetch /themes/<key>.css。
 * 失败的单个主题跳过，不影响其余主题出预览。
 * 始终带上 default.css——它是未声明变量的兜底来源。
 */
export async function loadThemeCss(names: string[]): Promise<void> {
    if (cssText.size > 0) return;

    const all = Array.from(new Set([DEFAULT_KEY, ...names]));
    const embedded = embeddedThemes();
    const pending: { key: string; url: string }[] = [];

    for (const name of all) {
        const key = themeCssKey(name);
        if (embedded[key]) {
            cssText.set(key, embedded[key]);
            continue;
        }
        // 相对路径：与 index.html 里 <link href="/themes/..."> 同源，
        // 子路径部署（GitHub Pages）下用绝对路径会 404
        const base = document.getElementById('current-theme')?.getAttribute('href') || '';
        const dir = base.includes('/') ? base.slice(0, base.lastIndexOf('/')) : '/themes';
        pending.push({ key, url: `${dir}/${key}.css` });
    }

    await Promise.all(
        pending.map(({ key, url }) =>
            fetch(url)
                .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
                .then((text) => cssText.set(key, text))
                .catch(() => undefined)
        )
    );

    injectAll();
}

/** 取一套主题的真实色板；CSS 未就绪或取不到正文色时返回 null */
export function getThemePalette(name: string): ThemePalette | null {
    if (!injected || !probe) return null;
    const key = themeCssKey(name);
    if (!cssText.has(key)) return null;

    probe.dataset.t = key;
    const cs = getComputedStyle(probe);
    const read = (v: string) => cs.getPropertyValue(v).trim();

    // --ui-surface 是 color-mix() 表达式：自定义属性不会把它求值成颜色，
    // 读出来只是字符串。借 backgroundColor 让浏览器真正现算；
    // 算不出来（旧内核不支持 color-mix）回落到页面底色
    probe.style.backgroundColor = 'var(--ui-surface)';
    let panel = getComputedStyle(probe).backgroundColor;
    probe.style.backgroundColor = '';
    if (!panel || panel === 'rgba(0, 0, 0, 0)') panel = read('--bg-color');

    // --home-window-bg-color 有些主题没定义，回落到 --bg-color
    const bg = read('--bg-color');
    const text = read('--head-text-color');
    // 取不到正文色说明这套主题的变量没进来，作废
    if (!panel || !bg || !text) return null;

    const primary = read('--primary-color');
    const error = read('--error-color') || read('--monkey-error-color');
    // 主题名是次要信息，但正文色对比不足（实测 avocado 2.9 / botanical 1.6）
    // 时名字会糊进卡片底色，按底色明暗兜底成黑/白
    const nameText = (() => {
        const cr = contrastRatio(text, bg);
        if (cr !== null && cr >= 3) return text;
        return isLightColor(bg) ? '#202124' : '#f2f3f5';
    })();
    return {
        bg,
        panel,
        text,
        sub: read('--home-window-text-sub-color'),
        // 撞色主题（nothing / nothing dark）运行时红色专用于打错，
        // 「打对」退回亮度表达——预览与真实打字界面保持一致
        primary: isColorClash(primary, error) ? text : primary,
        error,
        success: read('--success-color') || primary,
        caret: read('--monkey-caret-color') || primary,
        current: read('--home-input-focus-color'),
        nameText,
    };
}

/** 面板关闭后清理注入的样式与探针，避免 DOM 堆积 */
export function disposeThemePalette(): void {
    injected?.remove();
    probe?.remove();
    injected = null;
    probe = null;
    cssText.clear();
}
