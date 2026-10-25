// 从 words.json 生成 src/words.ts（打字词库）
// 运行: npm run word
//
// 拼音库用 pinyin-pro 而不是原来的 chinese-to-pinyin：
// 后者已不在依赖里（node_modules 只有 pinyin-pro），这条链子此前是坏的。
// pinyin-pro 额外支持多音字按词组语境取音，与打字时输入法的行为一致。
//
// 注意 pinyin-pro 是纯 ESM 包，CommonJS 的 require 只能拿到模块命名空间
// 对象（没有默认导出可调用），必须走动态 import()。
const FS = require('fs');
const Path = require('path');
const Mustache = require('mustache');

const ROOT = Path.join(__dirname, '..');
const wordsStr = require(Path.join(ROOT, 'words.json')).words;

const wordsTemplate = Path.join(ROOT, 'template', 'words.mustache');
const wordsFile = Path.join(ROOT, 'src', 'words.ts');

const main = async () => {
    const { pinyin } = await import('pinyin-pro');

    const wordList = wordsStr
        .split('|')
        .map((str) => str.trim())
        .filter(Boolean)
        // 同一个词重复出现只保留第一次，避免词库膨胀
        .filter((str, i, arr) => arr.indexOf(str) === i)
        // 只收纯汉字词：双拼编码要求纯小写字母且长度 = 字数×2，
        // 含拉丁字母/数字的词（OEM高度、QMK、FR4、Alice配列…）编码必然异常，
        // 而且用户的拼音输入法也打不出来，练了没有意义
        .filter((str) => /^[\u4e00-\u9fff]+$/.test(str))
        .map((str) => ({
            label: str,
            // toneType: 'none' 去声调；type: 'array' 逐字取音，多音字按词组语境判定
            text: pinyin(str, { toneType: 'none', type: 'array' }).join(''),
        }));

    const tpl = FS.readFileSync(wordsTemplate, { encoding: 'utf8' });
    FS.writeFileSync(wordsFile, Mustache.render(tpl, { wordList }));

    console.log(`words: ${wordList.length}`);
    console.log('done.');
};

main();
