// 统计：内置词库/界面用到的汉字，落在多少个字体分片里
// 用法: node scripts/analyze-font-slices.js
const FS = require('fs');
const Path = require('path');

const ROOT = Path.join(__dirname, '..');
const DIST = Path.join(ROOT, 'dist-single');

/* ---------- 1. 收集"内置内容"用到的汉字 ---------- */
const cjk = new Set();

function addText(t) {
    // 还原 \uXXXX 转义（词库在源码里是转义写法）
    const unescaped = t.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
    for (const ch of unescaped) {
        const c = ch.codePointAt(0);
        if (c >= 0x3400 && c <= 0x9fff) cjk.add(c);
        if (c >= 0xf900 && c <= 0xfaff) cjk.add(c);
    }
}

function walk(dir) {
    for (const name of FS.readdirSync(dir)) {
        if (name === 'node_modules' || name.startsWith('.')) continue;
        const p = Path.join(dir, name);
        const st = FS.statSync(p);
        if (st.isDirectory()) walk(p);
        else if (/\.(tsx?|jsx?|less|json|html)$/.test(name)) addText(FS.readFileSync(p, 'utf8'));
    }
}
walk(Path.join(ROOT, 'src'));
addText(FS.readFileSync(Path.join(ROOT, 'words.json'), 'utf8'));
addText(FS.readFileSync(Path.join(ROOT, 'index.html'), 'utf8'));

console.log('内置内容汉字数:', cjk.size);

/* ---------- 2. 分片命中统计 ---------- */
function parseRanges(str) {
    return str.split(',').map((s) => {
        const t = s.trim().replace(/^U\+/i, '');
        const [a, b] = t.split('-');
        return [parseInt(a, 16), parseInt(b ?? a, 16)];
    });
}

for (const name of ['shs.css', 'lxgw.css']) {
    const css = FS.readFileSync(Path.join(DIST, 'fonts', name), 'utf8');
    const blocks = css.match(/@font-face\s*\{[\s\S]*?\}/g) || [];
    let keep = 0;
    let keepBytes = 0;
    let allBytes = 0;
    for (const b of blocks) {
        const ur = /unicode-range:\s*([^;]+);/.exec(b);
        const url = /url\('([^']+)'\)/.exec(b) || /url\(([^)]+)\)/.exec(b);
        const file = url && url[1].replace(/^\/fonts\//, '');
        const size =
            file && FS.existsSync(Path.join(DIST, 'fonts', file))
                ? FS.statSync(Path.join(DIST, 'fonts', file)).size
                : 0;
        allBytes += size;
        const ranges = ur ? parseRanges(ur[1]) : [[0, 0x10ffff]];
        let hit = false;
        for (const c of cjk) {
            for (const [a, b2] of ranges) {
                if (c >= a && c <= b2) {
                    hit = true;
                    break;
                }
            }
            if (hit) break;
        }
        if (hit) {
            keep++;
            keepBytes += size;
        }
    }
    console.log(
        `${name}: ${blocks.length} 块 → 需要 ${keep} 块, ` +
            `${(keepBytes / 1048576).toFixed(2)}MB / 全量 ${(allBytes / 1048576).toFixed(2)}MB, ` +
            `base64 约 ${((keepBytes * 1.34) / 1048576).toFixed(2)}MB`
    );
}
