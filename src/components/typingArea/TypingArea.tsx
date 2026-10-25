/*
 * 通用打字区组件（英文 / 代码 / 自定义文本复用）
 * 按字符序列渲染，逐字符判定正确/错误；支持退格修正、换行与制表符。
 * 中文词拼模式仍走 views/monkey 的原有逻辑，不经过本组件。
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';

import './TypingArea.less';
import ReloadBtn from '@/components/reloadBtn/ReloadBtn';
import TypeResult from '@/components/typeResult/TypeResult';
import StatBar from '@/components/statBar/StatBar';

const BACKSPACE_CODE = 8;
const TAB_CODE = 9;
const ENTER_CODE = 13;

interface CharState {
    char: string;
    /** null=未输入, true=正确, false=错误 */
    isCorrect: boolean | null;
}

export interface TypingResult {
    wpm: string;
    right: number;
    wrong: number;
    acc: number;
    secs: number;
}

/** 排版变体：prose=散文、code=代码、cn=中文词拼 */
export type TypingVariant = 'prose' | 'code' | 'cn';

interface Props {
    /** 待打文本，\n 视为换行 */
    text: string;
    /** 是否把制表符按 4 空格展开（代码模式） */
    expandTabs?: boolean;
    /** 排版变体，决定字体/字号/行距/换行策略 */
    variant?: TypingVariant;
    /**
     * 每个字符对应的期望按键串（与 text 逐字符对齐）。
     * 不传 = 一键一字符（英文 / 代码的原有行为）。
     * 传入则进入编码模式：汉字给拼音编码（全拼/双拼），
     * 英文数字标点给自身，于是一个汉字要敲多个键。
     */
    codes?: string[];
    /** 编码模式下是否在汉字下方显示拼音提示行 */
    showPinyin?: boolean;
    /** 结果回调 */
    onResult?: (result: TypingResult) => void;
    /** 速度单位标签 */
    unit?: string;
}

const TAB_WIDTH = 4;

/** 把制表符展开成空格 */
const expandTabs = (text: string, width = TAB_WIDTH) => text.replace(/\t/g, ' '.repeat(width));

/**
 * 编码提示行的显示内容。
 * 汉字/字母直接显示编码；空格与换行显示按键符号 —— 这两个单元的
 * code 就是字符本身（' ' / '\n'），原样显示等于什么都不显示，
 * 用户看不出这里需要敲键，也就无从对照。
 */
function hintOf(char: string, code: string): { text: string; isKey: boolean } {
    if (char === ' ') return { text: '␣', isKey: true };
    if (char === '\n') return { text: '↵', isKey: true };
    if (char === '\t') return { text: '⇥', isKey: true };
    return { text: code, isKey: false };
}

const TypingArea: React.FC<Props> = (props) => {
    const { text, expandTabs: useExpandTabs = false, variant = 'prose', onResult } = props;
    const rawText = useExpandTabs ? expandTabs(text) : text;
    // 编码模式：调用方给了逐字符的期望按键串才启用，否则维持一键一字符
    const codes =
        props.codes && props.codes.length === Array.from(rawText).length ? props.codes : null;
    const showPinyin = !!codes && !!props.showPinyin;

    const inputEl = useRef(null);
    const textEl = useRef(null);
    const panelEl = useRef(null);
    const caretElRef = useRef(null);
    const beginTimeRef = useRef(0);
    const [chars, setChars] = useState<CharState[]>(() =>
        Array.from(rawText).map((char) => ({ char, isCorrect: null }))
    );
    const [index, setIndex] = useState(0);
    // 编码模式：当前单元已敲入的按键（一个汉字要敲多个键）
    const [buffer, setBuffer] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isCaretFlash, setIsCaretFlash] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [caretPos, setCaretPos] = useState({ top: 0, left: 0, height: 0 });
    const [liveSecs, setLiveSecs] = useState(0);
    const [result, setResult] = useState<TypingResult>({
        wpm: '',
        right: 0,
        wrong: 0,
        acc: 0,
        secs: 0,
    });
    // 成绩是否已结算（避免最后一次按键的异步闭包重复触发）
    const settledRef = useRef(false);

    // 文本变化时重置
    useEffect(() => {
        setChars(Array.from(rawText).map((char) => ({ char, isCorrect: null })));
        setIndex(0);
        setBuffer('');
        setShowResult(false);
        beginTimeRef.current = 0;
        settledRef.current = false;
        setIsTyping(false);
        setLiveSecs(0);
        setResult({ wpm: '', right: 0, wrong: 0, acc: 0, secs: 0 });
    }, [rawText]);

    /** 把光标定位到 index 对应的字符上 */
    const moveCaret = useCallback((nextIndex: number) => {
        const container = textEl.current as HTMLElement | null;
        const panel = panelEl.current as HTMLElement | null;
        if (!container || !panel) return;
        const charEls = Array.from(container.getElementsByClassName('char')) as HTMLElement[];
        const total = charEls.length;
        if (total === 0) return;
        // 越界时贴到末尾字符右侧
        const atEnd = nextIndex >= total;
        const ref = atEnd ? charEls[total - 1] : charEls[nextIndex];
        if (!ref) return;
        const panelRect = panel.getBoundingClientRect();
        const rect = ref.getBoundingClientRect();
        setCaretPos({
            top: rect.top - panelRect.top,
            left: rect.left - panelRect.left + (atEnd ? rect.width || 8 : 0),
            height: rect.height || 24,
        });
    }, []);

    useEffect(() => {
        moveCaret(index);
    }, [index, moveCaret, chars]);

    /** 输入过程中的计时 */
    useEffect(() => {
        if (!isTyping || showResult) return undefined;
        const timer = window.setInterval(() => {
            if (!beginTimeRef.current) return;
            setLiveSecs(Math.max(1, Math.round((Date.now() - beginTimeRef.current) / 1000)));
        }, 200);
        return () => window.clearInterval(timer);
    }, [isTyping, showResult]);

    /** 结算成绩并展示结果 */
    const settle = useCallback(
        (finalChars: CharState[]) => {
            if (settledRef.current) return;
            settledRef.current = true;
            const total = finalChars.length;
            const right = finalChars.filter((c) => c.isCorrect === true).length;
            const wrong = total - right;
            const secs = Math.max(1, Math.round((Date.now() - beginTimeRef.current) / 1000));
            const acc = total ? Math.round((right / total) * 100) : 0;
            const wpm = (right / (secs / 60)).toFixed(2);
            const r = { wpm, right, wrong, acc, secs };
            setResult(r);
            setShowResult(true);
            onResult && onResult(r);
        },
        [onResult]
    );

    const inputForward = useCallback(
        (key: string) => {
            if (showResult || settledRef.current) return;
            if (beginTimeRef.current === 0) {
                beginTimeRef.current = Date.now();
            }
            const target = chars[index];
            if (!target) return;

            if (codes) {
                // 编码模式：期望按键串可能多键（汉字拼音）。
                // 逐键累积，任何一键不符即整单元判错并清空重来，
                // 与 Monkey 的打满判定口径一致，不出现「半对」的歧义。
                const expect = codes[index];
                const next = buffer + key;
                if (expect.startsWith(next)) {
                    if (next.length === expect.length) {
                        const nextChars = chars.slice();
                        nextChars[index] = { ...target, isCorrect: true };
                        setChars(nextChars);
                        setBuffer('');
                        const nextIndex = index + 1;
                        setIndex(nextIndex);
                        if (nextIndex >= nextChars.length) settle(nextChars);
                    } else {
                        // 前缀正确，继续等后续按键
                        setBuffer(next);
                    }
                } else {
                    const nextChars = chars.slice();
                    nextChars[index] = { ...target, isCorrect: false };
                    setChars(nextChars);
                    setBuffer('');
                    // 判错不前进：用户重打这一单元
                }
                return;
            }

            const nextChars = chars.slice();
            nextChars[index] = { ...nextChars[index], isCorrect: key === nextChars[index].char };
            setChars(nextChars);
            const nextIndex = index + 1;
            setIndex(nextIndex);
            if (nextIndex >= nextChars.length) {
                settle(nextChars);
            }
        },
        [chars, index, showResult, settle, codes, buffer]
    );

    const backspace = useCallback(() => {
        // 编码模式：当前单元已敲了部分按键时，退格只回退缓冲，
        // 不退回上一个单元——避免「敲错一个键就丢掉整个字」的挫败感
        if (codes && buffer) {
            setBuffer((b) => b.slice(0, -1));
            return;
        }
        if (index <= 0) return;
        setChars((prev) => {
            const next = prev.slice();
            next[index - 1] = { ...next[index - 1], isCorrect: null };
            return next;
        });
        setIndex((i) => i - 1);
        // 回到上一个单元时，若该单元是多键编码，预填已敲内容
        // （此时它尚未判定，缓冲为空，无需处理）
    }, [index, codes, buffer]);

    const onKeyDown = (evt: React.KeyboardEvent) => {
        // Tab 保留给浏览器（切焦点），其余按键一律接管
        if (evt.keyCode !== TAB_CODE) {
            evt.preventDefault();
            evt.stopPropagation();
        }
        if (showResult) return;
        if (evt.keyCode === BACKSPACE_CODE) {
            backspace();
            return;
        }
        // 换行符：文本里的 \n 用 Enter 输入
        if (evt.keyCode === ENTER_CODE) {
            inputForward('\n');
            return;
        }
        if (evt.key.length === 1) {
            // 制表符统一按展开后的空格处理
            const key = evt.key === '\t' ? ' ' : evt.key;
            inputForward(key);
        }
    };

    const reload = useCallback(() => {
        setChars(Array.from(rawText).map((char) => ({ char, isCorrect: null })));
        setIndex(0);
        setBuffer('');
        setShowResult(false);
        beginTimeRef.current = 0;
        settledRef.current = false;
        setLiveSecs(0);
        setResult({ wpm: '', right: 0, wrong: 0, acc: 0, secs: 0 });
        setTimeout(() => {
            (inputEl.current as any)?.focus();
        }, 10);
    }, [rawText]);

    const focusToInput = () => {
        setIsTyping(true);
        (inputEl.current as any)?.focus();
    };

    const typedCount = chars.filter((c) => c.isCorrect !== null).length;
    const rightCount = chars.filter((c) => c.isCorrect === true).length;
    const liveAcc = typedCount ? Math.round((rightCount / typedCount) * 100) : 100;
    const liveWpm = liveSecs > 0 ? Math.round(rightCount / (liveSecs / 60)) : 0;
    const progress = chars.length ? Math.round((index / chars.length) * 100) : 0;
    const unit = props.unit || 'WPM';

    const mm = Math.floor(liveSecs / 60);
    const ss = String(liveSecs % 60).padStart(2, '0');

    return (
        <div className={`TypingArea TypingArea--${variant}`}>
            <div className="TypingArea__meta">
                <div className={`TypingArea__hint ${isTyping ? 'is-hidden' : ''}`}>
                    点击面板开始输入
                </div>
                <div className="TypingArea__meta-right">
                    <span className="TypingArea__count">
                        {index}/{chars.length}
                    </span>
                    <StatBar
                        active={typedCount > 0}
                        items={[
                            { label: unit, value: liveWpm },
                            { label: '准确率', value: `${liveAcc}%` },
                            { label: '用时', value: `${mm}:${ss}` },
                        ]}
                    />
                </div>
            </div>

            <div
                className={`TypingArea__panel ${isTyping ? 'is-live' : ''}`}
                onClick={focusToInput}
                ref={panelEl}
                role="textbox"
                aria-label="打字练习区，点击后开始输入"
                tabIndex={-1}
            >
                <div
                    className={`TypingArea__caret ${
                        isTyping ? (isCaretFlash ? 'flash' : '') : 'hide'
                    }`}
                    ref={caretElRef}
                    style={{
                        transform: `translate3d(${caretPos.left}px,${caretPos.top}px,0)`,
                        height: `${caretPos.height * 0.82}px`,
                    }}
                />
                <div className={`TypingArea__text ${showPinyin ? 'is-coded' : ''}`} ref={textEl}>
                    {chars.map((c, i) => {
                        const isSpace = c.char === ' ' || c.char === '\n' || c.char === '\t';
                        let cls = 'char ';
                        if (c.isCorrect === true) cls += 'correct';
                        else if (c.isCorrect === false) cls += 'wrong';
                        else cls += 'pending';
                        if (i === index && !showResult) cls += ' current';
                        // 空格在错误时用背景块提示，避免看不见
                        if (c.isCorrect === false && isSpace) cls += ' char-space-wrong';

                        // 编码模式：每个单元上方都挂提示。
                        // 汉字给拼音编码；空格/换行给按键符号 —— 这些单元
                        // code === char，此前被 codes[i] !== c.char 排除在提示
                        // 之外，用户看不出「这里要敲空格/回车」，打错也没有目标可对照。
                        // 换行单元也走这里：↵ 提示挂在换行处，仍渲染真实换行。
                        if (showPinyin && codes && codes[i]) {
                            const typed = i === index ? buffer : '';
                            const hint = hintOf(c.char, codes[i]);
                            // 全拼编码最长 6 字母（zhuang/chuang），居中显示会向两侧
                            // 各溢出约半个编码宽，与相邻单元的提示行重叠。
                            // 长编码单元向右撑出空间，提示改为左对齐，向空白处延伸。
                            const wide = hint.text.length >= 4;
                            return (
                                <span
                                    className={`${cls} char--coded ${
                                        hint.isKey ? 'char--key' : ''
                                    } ${wide ? 'char--wide' : ''}`}
                                    key={i}
                                >
                                    <i className={`char__hint ${hint.isKey ? 'is-key' : ''}`}>
                                        {hint.text}
                                    </i>
                                    <i
                                        className={`char__glyph ${
                                            isSpace && c.char !== '\n' ? 'blank' : ''
                                        }`}
                                    >
                                        {c.char === '\n' ? '\n' : isSpace ? ' ' : c.char}
                                    </i>
                                    {typed && <i className="char__typed">{typed}</i>}
                                </span>
                            );
                        }

                        // 换行符渲染为可见换行：代码模式保留空行与缩进
                        if (c.char === '\n') {
                            return (
                                <span className={cls} key={i}>
                                    {'\n'}
                                </span>
                            );
                        }

                        return (
                            <span className={cls} key={i}>
                                {isSpace ? ' ' : c.char}
                            </span>
                        );
                    })}
                </div>
                <div className="TypingArea__progress">
                    <i style={{ width: `${progress}%` }} />
                </div>
            </div>

            <div className="TypingArea__foot">
                <span className="TypingArea__tip">
                    {variant === 'code'
                        ? 'Enter 换行 · Tab 已禁用，制表符按 4 空格判定'
                        : showPinyin
                        ? '汉字按提示编码输入 · 退格可改 · 打错重打本字'
                        : '支持退格修正 · 打错不影响继续'}
                </span>
                <ReloadBtn onClick={reload} />
            </div>

            {showResult && (
                <div className="TypingArea__result">
                    <TypeResult
                        desc={unit}
                        numStr={result.wpm}
                        acc={result.acc}
                        secs={result.secs}
                    />
                </div>
            )}

            <input
                className="TypingArea__hidden-input"
                type="text"
                ref={inputEl}
                onKeyDown={onKeyDown}
                onCompositionStart={(evt) => evt.preventDefault()}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                readOnly
                onBlur={() => setIsTyping(false)}
                onFocus={() => {
                    setIsTyping(true);
                    setIsCaretFlash(true);
                }}
            />
        </div>
    );
};

export default TypingArea;
