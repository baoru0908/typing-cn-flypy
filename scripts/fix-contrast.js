// 对比度修复：把主题里正文/主色对比度不达标的颜色自动调整到 WCAG 达标
// 运行: node scripts/fix-contrast.js
// 目标：正文 head-text-color 对 bg-color >= 4.5；primary-color / monkey-caret-color >= 3.0
// 策略：保持色相，只调亮度——暗底调亮、亮底调暗，直到达标或达到步数上限。
const FS = require('fs');
const Path = require('path');

const THEMES_DIR = Path.join(__dirname, '..', 'public', 'themes');
const TEXT_MIN = 4.5;
const ACCENT_MIN = 3.0;

const hex2rgb = (h) => {
    h = h.replace('#', '');
    if (h.length === 3) h = [...h].map((c) => c + c).join('');
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const rgb2hex = (rgb) =>
    '#' + rgb.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
const lum = ([r, g, b]) => {
    const f = (v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
    const l1 = lum(hex2rgb(a));
    const l2 = lum(hex2rgb(b));
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};
const isHex = (v) => typeof v === 'string' && /^#[0-9a-f]{3,6}$/i.test(v.trim());

/** 朝目标方向调整亮度（保持色相） */
const adjust = (hex, dir, steps) => {
    let rgb = hex2rgb(hex);
    for (let i = 0; i < steps; i += 1) {
        rgb = rgb.map((v) => (dir > 0 ? Math.min(255, v + 12) : Math.max(0, v - 12)));
    }
    return rgb2hex(rgb);
};

/** 找到满足目标对比度的最小调整步数 */
const solve = (fg, bg, target) => {
    if (ratio(fg, bg) >= target) return null;
    const bgL = lum(hex2rgb(bg));
    const dir = bgL > 0.4 ? -1 : 1; // 亮底压暗，暗底提亮
    for (let steps = 1; steps <= 20; steps += 1) {
        const cand = adjust(fg, dir, steps);
        if (ratio(cand, bg) >= target) return cand;
    }
    return null;
};

let changed = [];
for (const file of FS.readdirSync(THEMES_DIR)) {
    if (!file.endsWith('.css')) continue;
    const full = Path.join(THEMES_DIR, file);
    let css = FS.readFileSync(full, 'utf8');
    const getVar = (name) => {
        const m = css.match(new RegExp('--' + name + ':\\s*([^;]+);'));
        return m ? m[1].trim() : null;
    };
    const bg = getVar('bg-color');
    if (!isHex(bg)) continue;
    // 打字区光标/面板强调色实际画在面板底色上，而不是页面 bg-color 上。
    // typing-panel-bg-color 的值恒为 var(--home-window-bg-color)（40 套全是），
    // 直接读它拿到的是变量引用、isHex 判假，面板色就静默回落成了 bg-color。
    // 这里先解析一层 var() 引用，否则对面板的对比度检查一直是错的。
    const resolveVar = (v) => {
        if (!v) return v;
        const m = /^var\(--([\w-]+)\)$/.exec(v.trim());
        return m ? getVar(m[1]) : v;
    };
    const panelRaw = resolveVar(getVar('typing-panel-bg-color')) || getVar('home-window-bg-color');
    const panel = isHex(panelRaw) ? panelRaw : bg;

    const edits = [];
    // 正文色（页面背景上的文字）
    for (const name of ['head-text-color']) {
        const v = getVar(name);
        if (!isHex(v)) continue;
        const fixed = solve(v, bg, TEXT_MIN);
        if (fixed) edits.push([name, v, fixed]);
    }
    // 强调色：页面上的强调对 bg 达标，面板上的光标/选中对 panel 达标
    for (const name of ['primary-color', 'word-count-checked-color']) {
        const v = getVar(name);
        if (!isHex(v)) continue;
        const fixed = solve(v, bg, ACCENT_MIN);
        if (fixed) edits.push([name, v, fixed]);
    }
    for (const name of ['monkey-caret-color']) {
        const v = getVar(name);
        if (!isHex(v)) continue;
        const fixed = solve(v, panel, ACCENT_MIN);
        if (fixed) edits.push([name, v, fixed]);
    }
    // 打错/打对色画在打字区面板上（主题预览卡同样画在面板底色上），对 panel 达标
    for (const name of ['error-color', 'success-color']) {
        const v = getVar(name);
        if (!isHex(v)) continue;
        const fixed = solve(v, panel, ACCENT_MIN);
        if (fixed) edits.push([name, v, fixed]);
    }

    if (!edits.length) continue;
    for (const [name, from, to] of edits) {
        // 只替换 :root 块内该变量的定义值（变量引用形式如 var(--x) 不动）
        const re = new RegExp('(--' + name + ':\\s*)' + from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        css = css.replace(re, `$1${to}`);
    }
    FS.writeFileSync(full, css);
    changed.push({ file, edits });
    console.log(file, '->', edits.map(([n, f, t]) => `${n}: ${f}→${t}`).join(', '));
}
console.log(`\n修复 ${changed.length} 个主题`);
