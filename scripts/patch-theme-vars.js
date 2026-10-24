// 给全部主题补齐打字区所需的一组语义变量（带合理回退值，不改各主题既有取值）
// 运行: node scripts/patch-theme-vars.js
// 说明：只在缺失时追加，不覆盖主题已有定义；重复运行安全（幂等）。
const FS = require('fs');
const Path = require('path');

const THEMES_DIR = Path.join(__dirname, '..', 'public', 'themes');

// 打字区/代码区专用的语义变量及其回退值（回退链基于既有变量）
const VARS = [
    // 打字区面板底色（毛玻璃主题自身已是半透明色，直接沿用 --home-window-bg-color）
    ['--typing-panel-bg-color', 'var(--home-window-bg-color)'],
    // 打字区面板边框：默认透明，毛玻璃类主题自行覆盖
    ['--typing-panel-border-color', 'transparent'],
    // 打字区正文色（未输入字符）
    ['--typing-text-color', 'var(--head-text-color)'],
    // 已输入正确字符色
    ['--typing-correct-color', 'var(--primary-color)'],
    // 错误字符色
    ['--typing-error-color', 'var(--monkey-error-color)'],
    // 错误字符的浅色底（透明度由各主题决定，默认 14%）
    ['--typing-error-bg-color', 'rgba(245, 34, 45, 0.14)'],
    // 当前光标所在字符的底色
    ['--typing-current-bg-color', 'var(--home-input-focus-color)'],
    // 光标色
    ['--typing-caret-color', 'var(--monkey-caret-color)'],
    // 代码模式等宽字体栈
    ['--typing-code-font', "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace"],
];

const MARK = '/* typing-vars:auto */';

let patched = 0;
let skipped = 0;
for (const file of FS.readdirSync(THEMES_DIR)) {
    if (!file.endsWith('.css')) continue;
    const full = Path.join(THEMES_DIR, file);
    const src = FS.readFileSync(full, 'utf8');
    if (src.includes(MARK)) {
        skipped += 1;
        continue;
    }
    // 找 :root { ... } 第一个块，在其内部末尾插入
    const rootMatch = src.match(/:root\s*\{/);
    if (!rootMatch) {
        console.log('跳过（无 :root）:', file);
        continue;
    }
    const insertAt = rootMatch.index + rootMatch[0].length;
    const block = VARS.map(([k, v]) => `\n    ${k}: ${v};`).join('');
    const out = src.slice(0, insertAt) + block + '\n' + src.slice(insertAt);
    FS.writeFileSync(full, out);
    patched += 1;
    console.log('已补齐:', file);
}
console.log(`\n补齐 ${patched} 个主题，已存在跳过 ${skipped} 个`);
