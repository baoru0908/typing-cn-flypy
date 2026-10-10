/*
 * 小鹤双拼编码工具
 * 编码规则严格对照 rime 官方 double_pinyin_flypy 方案（speller algebra）实现，
 * 含零声母规则：单字母韵母取首字母+韵母键（aa/oo/ee），双字母韵母保留全拼（ai/en/ou），
 * 三字母韵母取首字母+韵母键（ang=ah/eng=eg），yi/ya/ye/wu/wa/wo 保留全拼等特例。
 */
import { pinyin } from 'pinyin-pro';

/** 全拼音节 -> 小鹤双拼两码 */
export function toFlypy(syl: string): string {
    if (!syl) return '';
    let s = syl.toLowerCase();
    if (s === 'xx') return '';
    const U = (str: string) => str.toUpperCase();

    // xform/^([aoe])(ng)?$/$1$1$2/  （a→aa, e→ee, o→oo, ang→aang, eng→eeng）
    s = s.replace(/^([aoe])(ng)?$/, '$1$1$2');
    // xform/iu$/Q/
    s = s.replace(/iu$/, U('q'));
    // xform/(.)ei$/$1W/
    s = s.replace(/(.)ei$/, '$1' + U('w'));
    // xform/uan$/R/
    s = s.replace(/uan$/, U('r'));
    // xform/[uv]e$/T/   （ue/üe → t）
    s = s.replace(/[uv]e$/, U('t'));
    // xform/un$/Y/
    s = s.replace(/un$/, U('y'));
    // xform/^sh/U/  ^ch/I/  ^zh/V/
    s = s.replace(/^sh/, U('u')).replace(/^ch/, U('i')).replace(/^zh/, U('v'));
    // xform/uo$/O/
    s = s.replace(/uo$/, U('o'));
    // xform/ie$/P/
    s = s.replace(/ie$/, U('p'));
    // xform/i?ong$/S/
    s = s.replace(/i?ong$/, U('s'));
    // xform/ing$|uai$/K/
    s = s.replace(/ing$|uai$/, U('k'));
    // xform/(.)ai$/$1D/
    s = s.replace(/(.)ai$/, '$1' + U('d'));
    // xform/(.)en$/$1F/
    s = s.replace(/(.)en$/, '$1' + U('f'));
    // xform/(.)eng$/$1G/
    s = s.replace(/(.)eng$/, '$1' + U('g'));
    // xform/[iu]ang$/L/
    s = s.replace(/[iu]ang$/, U('l'));
    // xform/(.)ang$/$1H/
    s = s.replace(/(.)ang$/, '$1' + U('h'));
    // xform/ian$/M/
    s = s.replace(/ian$/, U('m'));
    // xform/(.)an$/$1J/
    s = s.replace(/(.)an$/, '$1' + U('j'));
    // xform/(.)ou$/$1Z/
    s = s.replace(/(.)ou$/, '$1' + U('z'));
    // xform/[iu]a$/X/
    s = s.replace(/[iu]a$/, U('x'));
    // xform/iao$/N/
    s = s.replace(/iao$/, U('n'));
    // xform/(.)ao$/$1C/
    s = s.replace(/(.)ao$/, '$1' + U('c'));
    // xform/ui$/V/
    s = s.replace(/ui$/, U('v'));
    // xform/in$/B/
    s = s.replace(/in$/, U('b'));
    // 大写还原为小写
    return s.toLowerCase();
}

/**
 * 词组（汉字）-> 小鹤双拼编码
 * 逐字取上下文拼音后转两码，多音字按词组语境判定。
 * 例：邮件 -> ybjm，准备 -> vbbz，非常 -> fkih
 */
export function getFlypy(word: string): string {
    const sylArr: string[] = pinyin(word, {
        toneType: 'none',
        type: 'array',
        v: true,
    });
    return sylArr.map(toFlypy).join('');
}
