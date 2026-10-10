// 把 dist-single 打包成真正的单文件 HTML：
// 内联主 JS / 主 CSS / 默认主题 CSS / favicon，主题切换在单文件版安全降级
// 运行: node scripts/pack-single.js
const FS = require('fs');
const Path = require('path');

const ROOT = Path.join(__dirname, '..');
const DIST = Path.join(ROOT, 'dist-single');
const OUT = Path.join(ROOT, '..', 'typing-cn-小鹤双拼.html');

const read = (p) => FS.readFileSync(Path.join(DIST, p), 'utf8');
const readB64 = (p) => FS.readFileSync(Path.join(DIST, p)).toString('base64');

let html = read('index.html');

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

// 3. 默认主题 CSS 内联 + 全部主题内嵌到 window.__THEMES__（供单文件版切换主题）
const defaultCss = read(Path.join('themes', 'default.css'));
html = html.replace(
    /<link id="default-theme"[^>]*>/,
    () => '<style id="default-theme">' + defaultCss + '</style>'
);
html = html.replace(
    /<link id="current-theme"[^>]*>/,
    () => '<style id="current-theme">' + defaultCss + '</style>'
);
const themesMap = {};
for (const f of FS.readdirSync(Path.join(DIST, 'themes')).filter((f) => f.endsWith('.css'))) {
    themesMap[f.replace(/\.css$/, '')] = read(Path.join('themes', f));
}
const themesJs = JSON.stringify(themesMap).replace(/<\//g, '<\\/');
html = html.replace(
    '<style id="current-theme">',
    '<script>window.__THEMES__ = ' + themesJs + ';</script><style id="current-theme">'
);

// 4. favicon 内联为 data URI
const favicon = FS.readdirSync(Path.join(DIST, 'assets')).find((f) => /^favicon\..+\.svg$/.test(f));
if (favicon) {
    html = html.replace(
        /href="\.\/assets\/favicon\.[^"]+"/,
        () => 'href="data:image/svg+xml;base64,' + readB64(Path.join('assets', favicon)) + '"'
    );
}

// 检查残留外部引用（不含 data: 与 http）
const leftovers = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((u) => !/^(data:|https?:|#)/.test(u));
if (leftovers.length) {
    console.log('残留外部引用:', [...new Set(leftovers)]);
}

FS.writeFileSync(OUT, html);
console.log('输出:', OUT, (FS.statSync(OUT).size / 1024 / 1024).toFixed(2) + 'MB');
