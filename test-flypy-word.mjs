// 用项目内安装的 pinyin-pro + flypy.ts 转换器，对真实词库做端到端测试
// 运行: node --experimental-strip-types test-flypy-mts.mjs  （Node 22 类型剥离）
import { getFlypy, toFlypy } from './src/utils/flypy.ts';

const cases = [
    ['邮件', 'ybjm'],
    ['离开', 'lkkl'],
    ['准备', 'vbbz'],
    ['庆祝', 'qkvz'],
    ['宿舍', 'suue'],
    ['注意', 'vuyi'],
    ['非常', 'fkih'],
    ['家庭', 'jatm'],
    ['去年', 'qnnm'],
    ['真爱', 'vfai'],
    ['阳光', 'yhgl'],
    ['永远', 'yyyr'],
    ['新闻', 'xbwf'],
    ['长安', 'ihaj'],
];

let fail = 0;
for (const [word, expect] of cases) {
    const got = getFlypy(word);
    if (got !== expect) {
        fail++;
        console.log(`FAIL ${word} 期望 ${expect} 实际 ${got}`);
    }
}

// 全词库扫描：双拼模式下每个词组的编码必须是纯小写字母且长度 = 2×字数
const fs = await import('node:fs');
const wordsTs = fs.readFileSync('./src/words.ts', 'utf8');
const labels = [...wordsTs.matchAll(/label: '([^']+)'/g)].map((m) => m[1]);
let bad = 0;
for (const label of labels) {
    const code = getFlypy(label);
    if (!/^[a-z]+$/.test(code) || code.length !== Array.from(label).length * 2) {
        bad++;
        console.log('BAD', label, code);
    }
}
console.log(`抽样 ${cases.length} 条，词库共 ${labels.length} 个词组，编码异常 ${bad} 个，抽样失败 ${fail}`);
process.exit(fail || bad ? 1 : 0);
