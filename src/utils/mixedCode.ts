/*
 * 混合文本 → 打字练习单元
 *
 * 自定义模式原来是纯逐字符比对（key === char），贴一段中文进去等于要求用户
 * 用键盘敲出汉字，实际做不到，中文在自定义模式里是废的。
 * 本模块把文本转成「期望输入序列」：汉字转成拼音编码（全拼或小鹤双拼），
 * 英文 / 数字 / 标点 / 空白原样保留，从而中英混排也能练。
 *
 * 为什么英文拆成单字母：pinyin-pro 对非汉字逐字符返回，音节数与字符数恒等
 * （实测 '我用keyboard打字' → 12 音节 / 12 字符），正好复用 TypingArea 的
 * 逐字符判定，不需要为混排单写一套引擎。
 *
 * 两种输入方案与 Monkey 的设置项保持一致：
 *   '1' 全拼 —— 一字一码串，如 键盘 -> jianpan
 *   '2' 双拼 —— 一字两码，如 键盘 -> jmpj
 */
import { pinyin } from 'pinyin-pro';

import { toFlypy } from './flypy';

/** 单个练习单元：要显示的字符 + 期望敲入的编码 */
export interface TypingUnit {
    /** 展示用字符（汉字 / 字母 / 标点 / 空白） */
    char: string;
    /** 期望输入；汉字为拼音编码，其余为字符本身 */
    code: string;
    /** 是否为汉字（决定排版与字距） */
    hanzi: boolean;
}

/** 汉字范围（含扩展 A 区，避免生僻字漏判） */
const HANZI_RE = /[\u3400-\u9fff]/;

export const isHanzi = (ch: string) => HANZI_RE.test(ch);

/**
 * 把任意文本转成练习单元序列。
 * inputMode: '1' 全拼 / '2' 小鹤双拼；其余值按原样（不打码）处理。
 *
 * pinyin-pro 的 type:'array' 保证「一个输入字符对应一个音节」：
 * 汉字给拼音，非汉字原样返回。因此可以直接按 index 与字符对齐，
 * 不需要额外的分词或分段逻辑。
 */
export function buildTypingUnits(text: string, inputMode: string): TypingUnit[] {
    const chars = Array.from(text);
    if (!chars.length) return [];

    let syllables: string[] = chars;
    try {
        syllables = pinyin(text, { toneType: 'none', type: 'array', v: true });
    } catch (e) {
        // 取拼音失败时退回原字符，至少还能当纯英文/标点练
        syllables = chars;
    }

    const units: TypingUnit[] = [];
    for (let i = 0; i < chars.length; i += 1) {
        const char = chars[i];
        const hanzi = isHanzi(char);
        let code = char;
        if (hanzi) {
            const syl = syllables[i];
            if (syl) {
                code =
                    inputMode === '2' ? toFlypy(syl) : syl.replace(/[^a-zA-Z]/g, '').toLowerCase();
            }
        }
        units.push({ char, code, hanzi });
    }
    return units;
}

/** 练习单元 → 期望输入序列（TypingArea 的 text 只认字符序列） */
export const unitsToCodes = (units: TypingUnit[]): string => units.map((u) => u.code).join('');

/**
 * 统计文本里汉字的比例，用于自动挑排版变体。
 * 与 Custom 原有的「中文占比 > 50% 用中文排版」保持同一口径。
 */
export function hanziRatio(text: string): number {
    const total = Array.from(text).filter((c) => !/\s/.test(c)).length;
    if (!total) return 0;
    const hanzi = Array.from(text).filter((c) => isHanzi(c)).length;
    return hanzi / total;
}
