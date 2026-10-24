// 收集「内置内容」用到的汉字码位：词库 + 句子 + 全部界面文案
// 单文件版据此裁剪字体分片，只有真正用得到的字才进 HTML
const FS = require('fs');
const Path = require('path');

const ROOT = Path.join(__dirname, '..');

function collect() {
    const cjk = new Set();
    const addText = (t) => {
        // 还原 \uXXXX 转义（词库在源码里是转义写法）
        const plain = t.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) =>
            String.fromCharCode(parseInt(h, 16))
        );
        for (const ch of plain) {
            const c = ch.codePointAt(0);
            if ((c >= 0x3400 && c <= 0x9fff) || (c >= 0xf900 && c <= 0xfaff)) cjk.add(c);
        }
    };
    const walk = (dir) => {
        for (const name of FS.readdirSync(dir)) {
            if (name === 'node_modules' || name.startsWith('.')) continue;
            const p = Path.join(dir, name);
            if (FS.statSync(p).isDirectory()) walk(p);
            else if (/\.(tsx?|jsx?|less|json|html)$/.test(name)) addText(FS.readFileSync(p, 'utf8'));
        }
    };
    walk(Path.join(ROOT, 'src'));
    addText(FS.readFileSync(Path.join(ROOT, 'words.json'), 'utf8'));
    addText(FS.readFileSync(Path.join(ROOT, 'index.html'), 'utf8'));
    return cjk;
}

function parseRanges(str) {
    return str.split(',').map((s) => {
        const t = s.trim().replace(/^U\+/i, '');
        const [a, b] = t.split('-');
        return [parseInt(a, 16), parseInt(b ?? a, 16)];
    });
}

function hits(charset, rangeStr) {
    const ranges = parseRanges(rangeStr);
    for (const c of charset) {
        for (const [a, b] of ranges) if (c >= a && c <= b) return true;
    }
    return false;
}

module.exports = { collect, parseRanges, hits };
