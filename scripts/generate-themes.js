// 批量生成新增的高级主题（亮/暗成对）
// 运行: node scripts/generate-themes.js
// 每个主题输出 public/themes/<slug>.css，同时打印需要手工加进 src/themes/config.ts 的条目
const FS = require('fs');
const Path = require('path');

const OUT_DIR = Path.join(__dirname, '..', 'public', 'themes');

/**
 * 主题定义：
 *  slug    文件名（主题切换用）
 *  name    config.ts 里的显示名
 *  vars    覆盖的 :root 变量
 *  extra   额外 CSS（如 body 背景、面板描边）
 */
const THEMES = [
    {
        slug: 'nord',
        name: 'nord',
        vars: {
            '--primary-color': '#88c0d0',
            '--success-color': '#a3be8c',
            '--error-color': '#bf616a',
            '--bg-color': '#2e3440',
            '--head-text-color': '#eceff4',
            '--home-window-bg-color': 'rgba(46, 52, 64, 0.72)',
            '--home-window-text-color': '#eceff4',
            '--home-window-text-sub-color': 'rgba(216, 222, 233, 0.6)',
            '--home-window-text-acting-bg-color': 'rgba(136, 192, 208, 0.2)',
            '--home-input-focus-color': 'rgba(136, 192, 208, 0.16)',
            '--home-countdown-bg-color': 'rgba(59, 66, 82, 0.9)',
            '--home-countdown-text-color': '#eceff4',
            '--home-reload-btn-bg-color': 'rgba(136, 192, 208, 0.7)',
            '--home-reload-btn-focus-color': 'rgba(136, 192, 208, 0.2)',
            '--home-reload-btn-text-color': '#2e3440',
            '--word-count-checked-color': '#88c0d0',
            '--monkey-caret-color': '#88c0d0',
            '--monkey-sub-color': 'rgba(216, 222, 233, 0.55)',
            '--monkey-error-color': '#bf616a',
        },
        extra: `body {
    --body-back-image: linear-gradient(160deg, #242933 0%, #2e3440 55%, #3b4252 100%);
}

.TypingArea__text {
    border-color: rgba(136, 192, 208, 0.14);
}

.app-header {
    background: rgba(46, 52, 64, 0.55) !important;
    backdrop-filter: blur(14px) saturate(140%);
    -webkit-backdrop-filter: blur(14px) saturate(140%);
    border: 1px solid rgba(136, 192, 208, 0.12);
    border-radius: 12px;
}`,
    },
    {
        slug: 'nord-light',
        name: 'nord light',
        vars: {
            '--primary-color': '#5e81ac',
            '--success-color': '#8fa876',
            '--error-color': '#bf616a',
            '--bg-color': '#eceff4',
            '--head-text-color': '#2e3440',
            '--home-window-bg-color': 'rgba(255, 255, 255, 0.78)',
            '--home-window-text-color': '#2e3440',
            '--home-window-text-sub-color': 'rgba(46, 52, 64, 0.55)',
            '--home-window-text-acting-bg-color': 'rgba(94, 129, 172, 0.16)',
            '--home-input-focus-color': 'rgba(94, 129, 172, 0.12)',
            '--home-countdown-bg-color': 'rgba(216, 222, 233, 0.85)',
            '--home-countdown-text-color': '#2e3440',
            '--home-reload-btn-bg-color': 'rgba(94, 129, 172, 0.75)',
            '--home-reload-btn-focus-color': 'rgba(94, 129, 172, 0.16)',
            '--home-reload-btn-text-color': '#ffffff',
            '--word-count-checked-color': '#5e81ac',
            '--monkey-caret-color': '#5e81ac',
            '--monkey-sub-color': 'rgba(46, 52, 64, 0.5)',
            '--monkey-error-color': '#bf616a',
        },
        extra: `body {
    --body-back-image: linear-gradient(160deg, #e5e9f0 0%, #eceff4 55%, #d8dee9 100%);
}

.TypingArea__text {
    border-color: rgba(94, 129, 172, 0.18);
}`,
    },

    {
        slug: 'gruvbox',
        name: 'gruvbox',
        vars: {
            '--primary-color': '#fabd2f',
            '--success-color': '#b8bb26',
            '--error-color': '#fb4934',
            '--bg-color': '#282828',
            '--head-text-color': '#ebdbb2',
            '--home-window-bg-color': 'rgba(60, 56, 54, 0.78)',
            '--home-window-text-color': '#ebdbb2',
            '--home-window-text-sub-color': 'rgba(235, 219, 178, 0.55)',
            '--home-window-text-acting-bg-color': 'rgba(250, 189, 47, 0.18)',
            '--home-input-focus-color': 'rgba(250, 189, 47, 0.14)',
            '--home-countdown-bg-color': 'rgba(80, 73, 69, 0.9)',
            '--home-countdown-text-color': '#ebdbb2',
            '--home-reload-btn-bg-color': 'rgba(250, 189, 47, 0.75)',
            '--home-reload-btn-focus-color': 'rgba(250, 189, 47, 0.2)',
            '--home-reload-btn-text-color': '#282828',
            '--word-count-checked-color': '#fabd2f',
            '--monkey-caret-color': '#fabd2f',
            '--monkey-sub-color': 'rgba(168, 153, 132, 0.75)',
            '--monkey-error-color': '#fb4934',
        },
        extra: `body {
    --body-back-image: linear-gradient(160deg, #1d2021 0%, #282828 55%, #3c3836 100%);
}

.TypingArea__text {
    border-color: rgba(250, 189, 47, 0.16);
}`,
    },
    {
        slug: 'gruvbox-light',
        name: 'gruvbox light',
        vars: {
            '--primary-color': '#b57614',
            '--success-color': '#79740e',
            '--error-color': '#cc241d',
            '--bg-color': '#fbf1c7',
            '--head-text-color': '#3c3836',
            '--home-window-bg-color': 'rgba(255, 255, 255, 0.8)',
            '--home-window-text-color': '#3c3836',
            '--home-window-text-sub-color': 'rgba(60, 56, 54, 0.55)',
            '--home-window-text-acting-bg-color': 'rgba(181, 118, 20, 0.16)',
            '--home-input-focus-color': 'rgba(181, 118, 20, 0.12)',
            '--home-countdown-bg-color': 'rgba(235, 219, 178, 0.85)',
            '--home-countdown-text-color': '#3c3836',
            '--home-reload-btn-bg-color': 'rgba(181, 118, 20, 0.8)',
            '--home-reload-btn-focus-color': 'rgba(181, 118, 20, 0.16)',
            '--home-reload-btn-text-color': '#fbf1c7',
            '--word-count-checked-color': '#b57614',
            '--monkey-caret-color': '#b57614',
            '--monkey-sub-color': 'rgba(102, 92, 84, 0.75)',
            '--monkey-error-color': '#cc241d',
        },
        extra: `body {
    --body-back-image: linear-gradient(160deg, #f2e5bc 0%, #fbf1c7 55%, #ebdbb2 100%);
}

.TypingArea__text {
    border-color: rgba(181, 118, 20, 0.2);
}`,
    },

    {
        slug: 'solarized-dark',
        name: 'solarized dark',
        vars: {
            '--primary-color': '#268bd2',
            '--success-color': '#859900',
            '--error-color': '#dc322f',
            '--bg-color': '#002b36',
            '--head-text-color': '#fdf6e3',
            '--home-window-bg-color': 'rgba(7, 54, 66, 0.8)',
            '--home-window-text-color': '#fdf6e3',
            '--home-window-text-sub-color': 'rgba(147, 161, 161, 0.7)',
            '--home-window-text-acting-bg-color': 'rgba(38, 139, 210, 0.2)',
            '--home-input-focus-color': 'rgba(38, 139, 210, 0.14)',
            '--home-countdown-bg-color': 'rgba(88, 110, 117, 0.5)',
            '--home-countdown-text-color': '#fdf6e3',
            '--home-reload-btn-bg-color': 'rgba(38, 139, 210, 0.75)',
            '--home-reload-btn-focus-color': 'rgba(38, 139, 210, 0.2)',
            '--home-reload-btn-text-color': '#fdf6e3',
            '--word-count-checked-color': '#268bd2',
            '--monkey-caret-color': '#268bd2',
            '--monkey-sub-color': 'rgba(147, 161, 161, 0.7)',
            '--monkey-error-color': '#dc322f',
        },
        extra: `body {
    --body-back-image: linear-gradient(160deg, #00212b 0%, #002b36 55%, #073642 100%);
}

.TypingArea__text {
    border-color: rgba(38, 139, 210, 0.2);
}`,
    },
    {
        slug: 'solarized-light',
        name: 'solarized light',
        vars: {
            '--primary-color': '#268bd2',
            '--success-color': '#859900',
            '--error-color': '#dc322f',
            '--bg-color': '#fdf6e3',
            '--head-text-color': '#073642',
            '--home-window-bg-color': 'rgba(255, 255, 255, 0.82)',
            '--home-window-text-color': '#073642',
            '--home-window-text-sub-color': 'rgba(101, 123, 131, 0.8)',
            '--home-window-text-acting-bg-color': 'rgba(38, 139, 210, 0.14)',
            '--home-input-focus-color': 'rgba(38, 139, 210, 0.1)',
            '--home-countdown-bg-color': 'rgba(238, 232, 213, 0.9)',
            '--home-countdown-text-color': '#073642',
            '--home-reload-btn-bg-color': 'rgba(38, 139, 210, 0.8)',
            '--home-reload-btn-focus-color': 'rgba(38, 139, 210, 0.16)',
            '--home-reload-btn-text-color': '#fdf6e3',
            '--word-count-checked-color': '#268bd2',
            '--monkey-caret-color': '#268bd2',
            '--monkey-sub-color': 'rgba(101, 123, 131, 0.8)',
            '--monkey-error-color': '#dc322f',
        },
        extra: `body {
    --body-back-image: linear-gradient(160deg, #eee8d5 0%, #fdf6e3 55%, #f5e9c8 100%);
}

.TypingArea__text {
    border-color: rgba(38, 139, 210, 0.18);
}`,
    },

    {
        slug: 'catppuccin-mocha',
        name: 'catppuccin mocha',
        vars: {
            '--primary-color': '#cba6f7',
            '--success-color': '#a6e3a1',
            '--error-color': '#f38ba8',
            '--bg-color': '#1e1e2e',
            '--head-text-color': '#cdd6f4',
            '--home-window-bg-color': 'rgba(49, 50, 68, 0.75)',
            '--home-window-text-color': '#cdd6f4',
            '--home-window-text-sub-color': 'rgba(166, 173, 200, 0.65)',
            '--home-window-text-acting-bg-color': 'rgba(203, 166, 247, 0.2)',
            '--home-input-focus-color': 'rgba(203, 166, 247, 0.14)',
            '--home-countdown-bg-color': 'rgba(69, 71, 90, 0.85)',
            '--home-countdown-text-color': '#cdd6f4',
            '--home-reload-btn-bg-color': 'rgba(203, 166, 247, 0.75)',
            '--home-reload-btn-focus-color': 'rgba(203, 166, 247, 0.2)',
            '--home-reload-btn-text-color': '#1e1e2e',
            '--word-count-checked-color': '#cba6f7',
            '--monkey-caret-color': '#cba6f7',
            '--monkey-sub-color': 'rgba(166, 173, 200, 0.6)',
            '--monkey-error-color': '#f38ba8',
        },
        extra: `body {
    --body-back-image: linear-gradient(160deg, #181825 0%, #1e1e2e 55%, #313244 100%);
}

.TypingArea__text {
    border-color: rgba(203, 166, 247, 0.16);
}`,
    },
    {
        slug: 'catppuccin-latte',
        name: 'catppuccin latte',
        vars: {
            '--primary-color': '#8839ef',
            '--success-color': '#40a02b',
            '--error-color': '#d20f39',
            '--bg-color': '#eff1f5',
            '--head-text-color': '#4c4f69',
            '--home-window-bg-color': 'rgba(255, 255, 255, 0.82)',
            '--home-window-text-color': '#4c4f69',
            '--home-window-text-sub-color': 'rgba(108, 111, 133, 0.7)',
            '--home-window-text-acting-bg-color': 'rgba(136, 57, 239, 0.12)',
            '--home-input-focus-color': 'rgba(136, 57, 239, 0.1)',
            '--home-countdown-bg-color': 'rgba(220, 224, 232, 0.85)',
            '--home-countdown-text-color': '#4c4f69',
            '--home-reload-btn-bg-color': 'rgba(136, 57, 239, 0.8)',
            '--home-reload-btn-focus-color': 'rgba(136, 57, 239, 0.14)',
            '--home-reload-btn-text-color': '#ffffff',
            '--word-count-checked-color': '#8839ef',
            '--monkey-caret-color': '#8839ef',
            '--monkey-sub-color': 'rgba(108, 111, 133, 0.7)',
            '--monkey-error-color': '#d20f39',
        },
        extra: `body {
    --body-back-image: linear-gradient(160deg, #e6e9ef 0%, #eff1f5 55%, #dce0e8 100%);
}

.TypingArea__text {
    border-color: rgba(136, 57, 239, 0.18);
}`,
    },

    {
        slug: 'tokyo-night',
        name: 'tokyo night',
        vars: {
            '--primary-color': '#7aa2f7',
            '--success-color': '#9ece6a',
            '--error-color': '#f7768e',
            '--bg-color': '#1a1b26',
            '--head-text-color': '#c0caf5',
            '--home-window-bg-color': 'rgba(36, 40, 59, 0.78)',
            '--home-window-text-color': '#c0caf5',
            '--home-window-text-sub-color': 'rgba(169, 177, 202, 0.6)',
            '--home-window-text-acting-bg-color': 'rgba(122, 162, 247, 0.2)',
            '--home-input-focus-color': 'rgba(122, 162, 247, 0.14)',
            '--home-countdown-bg-color': 'rgba(65, 72, 104, 0.85)',
            '--home-countdown-text-color': '#c0caf5',
            '--home-reload-btn-bg-color': 'rgba(122, 162, 247, 0.75)',
            '--home-reload-btn-focus-color': 'rgba(122, 162, 247, 0.2)',
            '--home-reload-btn-text-color': '#1a1b26',
            '--word-count-checked-color': '#7aa2f7',
            '--monkey-caret-color': '#7aa2f7',
            '--monkey-sub-color': 'rgba(169, 177, 202, 0.55)',
            '--monkey-error-color': '#f7768e',
        },
        extra: `body {
    --body-back-image: linear-gradient(160deg, #16161e 0%, #1a1b26 55%, #24283b 100%);
}

.TypingArea__text {
    border-color: rgba(122, 162, 247, 0.16);
}`,
    },
    {
        slug: 'tokyo-night-light',
        name: 'tokyo night light',
        vars: {
            '--primary-color': '#2d4f9e',
            '--success-color': '#3f7d3a',
            '--error-color': '#c0365c',
            '--bg-color': '#d5d6db',
            '--head-text-color': '#343b58',
            '--home-window-bg-color': 'rgba(255, 255, 255, 0.85)',
            '--home-window-text-color': '#343b58',
            '--home-window-text-sub-color': 'rgba(52, 59, 88, 0.6)',
            '--home-window-text-acting-bg-color': 'rgba(45, 79, 158, 0.14)',
            '--home-input-focus-color': 'rgba(45, 79, 158, 0.1)',
            '--home-countdown-bg-color': 'rgba(203, 206, 219, 0.85)',
            '--home-countdown-text-color': '#343b58',
            '--home-reload-btn-bg-color': 'rgba(45, 79, 158, 0.8)',
            '--home-reload-btn-focus-color': 'rgba(45, 79, 158, 0.14)',
            '--home-reload-btn-text-color': '#ffffff',
            '--word-count-checked-color': '#2d4f9e',
            '--monkey-caret-color': '#2d4f9e',
            '--monkey-sub-color': 'rgba(52, 59, 88, 0.55)',
            '--monkey-error-color': '#c0365c',
        },
        extra: `body {
    --body-back-image: linear-gradient(160deg, #c8cad3 0%, #d5d6db 55%, #cbcedb 100%);
}

.TypingArea__text {
    border-color: rgba(45, 79, 158, 0.2);
}`,
    },

    {
        slug: 'rose-pine',
        name: 'rose pine',
        vars: {
            '--primary-color': '#c4a7e7',
            '--success-color': '#9ccfd8',
            '--error-color': '#eb6f92',
            '--bg-color': '#191724',
            '--head-text-color': '#e0def4',
            '--home-window-bg-color': 'rgba(38, 35, 58, 0.8)',
            '--home-window-text-color': '#e0def4',
            '--home-window-text-sub-color': 'rgba(224, 222, 244, 0.5)',
            '--home-window-text-acting-bg-color': 'rgba(196, 167, 231, 0.2)',
            '--home-input-focus-color': 'rgba(196, 167, 231, 0.14)',
            '--home-countdown-bg-color': 'rgba(64, 61, 82, 0.85)',
            '--home-countdown-text-color': '#e0def4',
            '--home-reload-btn-bg-color': 'rgba(196, 167, 231, 0.72)',
            '--home-reload-btn-focus-color': 'rgba(196, 167, 231, 0.2)',
            '--home-reload-btn-text-color': '#191724',
            '--word-count-checked-color': '#c4a7e7',
            '--monkey-caret-color': '#c4a7e7',
            '--monkey-sub-color': 'rgba(110, 106, 134, 0.9)',
            '--monkey-error-color': '#eb6f92',
        },
        extra: `body {
    --body-back-image: linear-gradient(160deg, #131019 0%, #191724 55%, #26233a 100%);
}

.TypingArea__text {
    border-color: rgba(196, 167, 231, 0.16);
}`,
    },
    {
        slug: 'rose-pine-dawn',
        name: 'rose pine dawn',
        vars: {
            '--primary-color': '#907aa9',
            '--success-color': '#56949f',
            '--error-color': '#b4637a',
            '--bg-color': '#faf4ed',
            '--head-text-color': '#575279',
            '--home-window-bg-color': 'rgba(255, 250, 243, 0.85)',
            '--home-window-text-color': '#575279',
            '--home-window-text-sub-color': 'rgba(87, 82, 121, 0.6)',
            '--home-window-text-acting-bg-color': 'rgba(144, 122, 169, 0.16)',
            '--home-input-focus-color': 'rgba(144, 122, 169, 0.12)',
            '--home-countdown-bg-color': 'rgba(242, 233, 222, 0.9)',
            '--home-countdown-text-color': '#575279',
            '--home-reload-btn-bg-color': 'rgba(144, 122, 169, 0.78)',
            '--home-reload-btn-focus-color': 'rgba(144, 122, 169, 0.16)',
            '--home-reload-btn-text-color': '#faf4ed',
            '--word-count-checked-color': '#907aa9',
            '--monkey-caret-color': '#907aa9',
            '--monkey-sub-color': 'rgba(152, 147, 165, 0.9)',
            '--monkey-error-color': '#b4637a',
        },
        extra: `body {
    --body-back-image: linear-gradient(160deg, #f2e9de 0%, #faf4ed 55%, #fffaf3 100%);
}

.TypingArea__text {
    border-color: rgba(144, 122, 169, 0.2);
}`,
    },

    {
        slug: 'one-dark',
        name: 'one dark',
        vars: {
            '--primary-color': '#61afef',
            '--success-color': '#98c379',
            '--error-color': '#e06c75',
            '--bg-color': '#282c34',
            '--head-text-color': '#abb2bf',
            '--home-window-bg-color': 'rgba(40, 44, 52, 0.8)',
            '--home-window-text-color': '#abb2bf',
            '--home-window-text-sub-color': 'rgba(171, 178, 191, 0.6)',
            '--home-window-text-acting-bg-color': 'rgba(97, 175, 239, 0.2)',
            '--home-input-focus-color': 'rgba(97, 175, 239, 0.14)',
            '--home-countdown-bg-color': 'rgba(76, 82, 99, 0.85)',
            '--home-countdown-text-color': '#abb2bf',
            '--home-reload-btn-bg-color': 'rgba(97, 175, 239, 0.75)',
            '--home-reload-btn-focus-color': 'rgba(97, 175, 239, 0.2)',
            '--home-reload-btn-text-color': '#282c34',
            '--word-count-checked-color': '#61afef',
            '--monkey-caret-color': '#61afef',
            '--monkey-sub-color': 'rgba(92, 99, 112, 0.9)',
            '--monkey-error-color': '#e06c75',
        },
        extra: `body {
    --body-back-image: linear-gradient(160deg, #21252b 0%, #282c34 55%, #3b4048 100%);
}

.TypingArea__text {
    border-color: rgba(97, 175, 239, 0.16);
}`,
    },
    {
        slug: 'one-light',
        name: 'one light',
        vars: {
            '--primary-color': '#4078f2',
            '--success-color': '#50a14f',
            '--error-color': '#e45649',
            '--bg-color': '#fafafa',
            '--head-text-color': '#383a42',
            '--home-window-bg-color': 'rgba(255, 255, 255, 0.88)',
            '--home-window-text-color': '#383a42',
            '--home-window-text-sub-color': 'rgba(56, 58, 66, 0.6)',
            '--home-window-text-acting-bg-color': 'rgba(64, 120, 242, 0.12)',
            '--home-input-focus-color': 'rgba(64, 120, 242, 0.1)',
            '--home-countdown-bg-color': 'rgba(234, 234, 236, 0.9)',
            '--home-countdown-text-color': '#383a42',
            '--home-reload-btn-bg-color': 'rgba(64, 120, 242, 0.82)',
            '--home-reload-btn-focus-color': 'rgba(64, 120, 242, 0.14)',
            '--home-reload-btn-text-color': '#ffffff',
            '--word-count-checked-color': '#4078f2',
            '--monkey-caret-color': '#4078f2',
            '--monkey-sub-color': 'rgba(160, 162, 170, 0.9)',
            '--monkey-error-color': '#e45649',
        },
        extra: `body {
    --body-back-image: linear-gradient(160deg, #f0f0f2 0%, #fafafa 55%, #eaeaec 100%);
}

.TypingArea__text {
    border-color: rgba(64, 120, 242, 0.18);
}`,
    },
];

// 打字区语义变量（与 patch-theme-vars.js 保持一致）
const TYPING_VARS = [
    ['--typing-panel-bg-color', 'var(--home-window-bg-color)'],
    ['--typing-panel-border-color', 'transparent'],
    ['--typing-text-color', 'var(--head-text-color)'],
    ['--typing-correct-color', 'var(--primary-color)'],
    ['--typing-error-color', 'var(--monkey-error-color)'],
    ['--typing-error-bg-color', 'rgba(245, 34, 45, 0.14)'],
    ['--typing-current-bg-color', 'var(--home-input-focus-color)'],
    ['--typing-caret-color', 'var(--monkey-caret-color)'],
    ['--typing-code-font', "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace"],
];

const entries = [];
for (const t of THEMES) {
    const all = { ...Object.fromEntries(TYPING_VARS), ...t.vars };
    const body = Object.entries(all)
        .map(([k, v]) => `    ${k}: ${v};`)
        .join('\n');
    const css = `/* ${t.name} 主题 */\n:root {\n${body}\n}\n\n${t.extra}\n`;
    const file = Path.join(OUT_DIR, `${t.slug}.css`);
    FS.writeFileSync(file, css);
    entries.push(`    { name: '${t.name}', bgColor: '${t.vars['--bg-color']}', textColor: '${t.vars['--head-text-color']}' },`);
    console.log('已生成:', t.slug + '.css');
}

console.log('\n--- 请把下面几行加到 src/themes/config.ts 末尾（数组收尾 ] 之前） ---');
console.log(entries.join('\n'));
