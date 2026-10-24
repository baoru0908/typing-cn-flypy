/*
 * 汉字 / 编码分组
 * 把词组的完整编码切成「一字一组」，用于拼音与汉字逐字对齐显示。
 * 全拼取每个字的完整拼音，小鹤双拼取每字两码；
 * 若逐字编码拼接后与整词编码不一致（多音字、非汉字词等），退回整词单组。
 */
import { pinyin } from 'pinyin-pro';

import { toFlypy } from './flypy';

export interface CharGroup {
    hanzi: string;
    code: string;
}

export function buildCharGroups(label: string, code: string, inputMode: string): CharGroup[] {
    const chars = Array.from(label);
    if (!chars.length) return [{ hanzi: label, code }];

    try {
        const sylArr: string[] = pinyin(label, {
            toneType: 'none',
            type: 'array',
            v: true,
        });
        if (sylArr.length === chars.length) {
            const codes = sylArr.map((syl) =>
                inputMode === '2'
                    ? toFlypy(syl)
                    : syl.replace(/[^a-zA-Z]/g, '').toLowerCase()
            );
            const valid = codes.every((c) => c.length > 0) && codes.join('') === code;
            if (valid) {
                return chars.map((hanzi, i) => ({ hanzi, code: codes[i] }));
            }
        }
    } catch (e) {
        // 取拼音失败时退回整词
    }

    return [{ hanzi: label, code }];
}
