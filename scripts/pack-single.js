// 把 dist-single 打包成真正的单文件 HTML：
// 内联主 JS / 主 CSS / 默认主题 CSS / 全部主题 / favicon / 字体
// 运行: node scripts/pack-single.js
const FS = require('fs');
const Path = require('path');

const { collect, hits } = require('./font-charset');

const ROOT = Path.join(__dirname, '..');
const DIST = Path.join(ROOT, 'dist-single');
const OUT = Path.join(ROOT, '..', 'typing-cn-小鹤双拼.html');

// 单文件版只带思源黑体：霞鹜文楷要 97 片全量（4.4MB→base64 5.9MB），
// 两套都塞进去 HTML 会到 12MB。留一套完整的，另一套在设置里隐藏。
const INLINE_FONTS = ['shs.css'];
const DROP_FONTS = ['lxgw.css'];

const read = (p) => FS.readFileSync(Path.join(DIST, p), 'utf8');
const readB64 = (p) => FS.readFileSync(Path.join(DIST, p)).toString('base64');

let html = read('index.html');

// 0. 标记单文件环境（设置面板据此隐藏未内置的字族）
html = html.replace('</head>', '<script>window.__SINGLE_FILE__=true;</script></head>');

// 1. 主 CSS 内联
const cssFile = FS.readdirSync(Path.join(DIST, 'assets')).find((f) => /^style\..+\.css$/.test(f));
html = html.replace(
    /<link rel="stylesheet" href="\.\/assets\/style\.[^"]+">/,
    () => '<style>' + read(Path.join('assets', cssFile)) + '</style>'
);

// 2. 主 JS 内联（无外部 import，可安全内联为 module；转义 </script 防止提前闭合）
const jsFile = FS.readdirSync(Path.join(DIST, 'assets')).find((f) => /^index\..+\.js$/.test(f));
const js = read(Path.join('assets', jsFile)).replace(/<\/script/gi, '<\\/script');
html = html.replace(
    /<script type="module" crossorigin src="\.\/assets\/index\.[^"]+"><\/script>/,
    () => '<script type="module">' + js + '</script>'
);

// 3. 字体：按内置内容裁剪分片，再 base64 内联
//    未被裁掉的码位会自动回落到系统字体（苹方/微软雅黑），不会出现豆腐块
const charset = collect();
let fontStats = [];
for (const name of DROP_FONTS) {
    html = html.replace(new RegExp(`\\s*<link[^>]*href="\\./fonts/${name}"[^>]*>`), '');
}
for (const name of INLINE_FONTS) {
    const cssPath = Path.join(DIST, 'fonts', name);
    if (!FS.existsSync(cssPath)) continue;
    const raw = FS.readFileSync(cssPath, 'utf8');
    const blocks = raw.match(/@font-face\s*\{[\s\S]*?\}/g) || [];
    const kept = [];
    let bytes = 0;
    for (const b of blocks) {
        const ur = /unicode-range:\s*([^;]+);/.exec(b);
        if (ur && !hits(charset, ur[1])) continue;
        const m = /url\('([^']+)'\)/.exec(b) || /url\(([^)]+)\)/.exec(b);
        if (!m) continue;
        const rel = m[1].replace(/^\/fonts\//, '').replace(/^\.\//, '');
        const abs = Path.join(DIST, 'fonts', rel);
        if (!FS.existsSync(abs)) continue;
        bytes += FS.statSync(abs).size;
        kept.push(b.replace(m[0], `url(data:font/woff2;base64,${readB64(Path.join('fonts', rel))})`));
    }
    fontStats.push(`${name}: ${blocks.length} 片 → 保留 ${kept.length} 片 (${(bytes / 1048576).toFixed(2)}MB)`);
    html = html.replace(
        new RegExp(`\\s*<link[^>]*href="\\./fonts/${name}"[^>]*>`),
        () => '<style data-font="' + name + '">' + kept.join('\n') + '</style>'
    );
}

// 4. 默认主题 CSS 内联 + 全部主题内嵌到 window.__THEMES__（供单文件版切换主题）
const defaultCss = read(Path.join('themes', 'default.css'));
html = html.replace(/<link id="default-theme"[^>]*>/, () => '<style id="default-theme">' + defaultCss + '</style>');
html = html.replace(/<link id="current-theme"[^>]*>/, () => '<style id="current-theme">' + defaultCss + '</style>');
const themesMap = {};
for (const f of FS.readdirSync(Path.join(DIST, 'themes')).filter((f) => f.endsWith('.css'))) {
    themesMap[f.replace(/\.css$/, '')] = read(Path.join('themes', f));
}
const themesJs = JSON.stringify(themesMap).replace(/<\//g, '<\\/');
html = html.replace(
    '<style id="current-theme">',
    '<script>window.__THEMES__ = ' + themesJs + ';</script><style id="current-theme">'
);

// 5. favicon 内联为 data URI
const favicon = FS.readdirSync(Path.join(DIST, 'assets')).find((f) => /^favicon\..+\.svg$/.test(f));
if (favicon) {
    html = html.replace(
        /href="\.\/assets\/favicon\.[^"]+"/,
        () => 'href="data:image/svg+xml;base64,' + readB64(Path.join('assets', favicon)) + '"'
    );
}

// 检查残留外部引用（不含 data: 与 http）
// 说明：内联 JS 里 Vite 的预加载助手带有模板串 href="${r}"，那是 JS 字符串拼接、
// 不是真实标签属性，因此只扫 <script> 之外的标记区，避免误报。
const markup = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '');
const leftovers = [...markup.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((u) => !/^(data:|https?:|#)/.test(u));
if (leftovers.length) {
    console.log('残留外部引用:', [...new Set(leftovers)]);
}

FS.writeFileSync(OUT, html);
fontStats.forEach((s) => console.log('字体', s));
console.log('输出:', OUT, (FS.statSync(OUT).size / 1024 / 1024).toFixed(2) + 'MB');
