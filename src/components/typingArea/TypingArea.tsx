/*
 * 通用打字区组件（英文 / 代码 / 自定义文本复用）
 * 按字符序列渲染，逐字符判定正确/错误；支持退格修正、换行与制表符。
 * 中文词拼模式仍走 views/monkey 的原有逻辑，不经过本组件。
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Row, Col } from 'antd';

import './TypingArea.less';
import ReloadBtn from '@/components/reloadBtn/ReloadBtn';
import TypeResult from '@/components/typeResult/TypeResult';

const BACKSPACE_CODE = 8;
const TAB_CODE = 9;

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

interface Props {
    /** 待打文本，\n 视为换行 */
    text: string;
    /** 是否把制表符按 4 空格展开（代码模式） */
    expandTabs?: boolean;
    /** 结果回调 */
    onResult?: (result: TypingResult) => void;
}

const TAB_WIDTH = 4;

/** 把制表符展开成空格 */
const expandTabs = (text: string, width = TAB_WIDTH) => text.replace(/\t/g, ' '.repeat(width));

const TypingArea: React.FC<Props> = (props) => {
    const { text, expandTabs: useExpandTabs = false, onResult } = props;
    const rawText = useExpandTabs ? expandTabs(text) : text;

    const inputEl = useRef(null);
    const textEl = useRef(null);
    const caretElRef = useRef(null);
    const beginTimeRef = useRef(0);
    const [chars, setChars] = useState<CharState[]>(() =>
        Array.from(rawText).map((char) => ({ char, isCorrect: null }))
    );
    const [index, setIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [isCaretFlash, setIsCaretFlash] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [caretPos, setCaretPos] = useState({ top: 0, left: 0 });
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
        setShowResult(false);
        beginTimeRef.current = 0;
        settledRef.current = false;
        setIsTyping(false);
        setResult({ wpm: '', right: 0, wrong: 0, acc: 0, secs: 0 });
    }, [rawText]);

    /** 把光标定位到 index 对应的字符上 */
    const moveCaret = useCallback((nextIndex: number) => {
        const container = textEl.current as HTMLElement | null;
        if (!container) return;
        const charEls = Array.from(container.getElementsByClassName('char')) as HTMLElement[];
        const total = charEls.length;
        if (total === 0) return;
        // 越界时贴到末尾字符右侧
        const atEnd = nextIndex >= total;
        const ref = atEnd ? charEls[total - 1] : charEls[nextIndex];
        if (!ref) return;
        const containerRect = container.getBoundingClientRect();
        const rect = ref.getBoundingClientRect();
        setCaretPos({
            top: rect.top - containerRect.top,
            left: rect.left - containerRect.left + (atEnd ? rect.width || 8 : 0),
        });
    }, []);

    useEffect(() => {
        moveCaret(index);
    }, [index, moveCaret, chars]);

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
            const nextChars = chars.slice();
            nextChars[index] = { ...nextChars[index], isCorrect: key === nextChars[index].char };
            setChars(nextChars);
            const nextIndex = index + 1;
            setIndex(nextIndex);
            if (nextIndex >= nextChars.length) {
                settle(nextChars);
            }
        },
        [chars, index, showResult, settle]
    );

    const backspace = useCallback(() => {
        if (index <= 0) return;
        setChars((prev) => {
            const next = prev.slice();
            next[index - 1] = { ...next[index - 1], isCorrect: null };
            return next;
        });
        setIndex((i) => i - 1);
    }, [index]);

    const onKeyDown = (evt: React.KeyboardEvent) => {
        if (evt.keyCode !== TAB_CODE) {
            evt.preventDefault();
            evt.stopPropagation();
        }
        if (showResult) return;
        if (evt.keyCode === BACKSPACE_CODE) {
            backspace();
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
        setShowResult(false);
        beginTimeRef.current = 0;
        settledRef.current = false;
        setResult({ wpm: '', right: 0, wrong: 0, acc: 0, secs: 0 });
        setTimeout(() => {
            (inputEl.current as any)?.focus();
        }, 10);
    }, [rawText]);

    const focusToInput = () => {
        setIsTyping(true);
        (inputEl.current as any)?.focus();
    };

    return (
        <div className="TypingArea">
            <Row justify="center" align="middle">
                <Col flex="900px">
                    <div
                        className={`TypingArea__caret ${
                            isTyping ? (isCaretFlash ? 'flash' : '') : 'hide'
                        }`}
                        ref={caretElRef}
                        style={{
                            transform: `translate3d(${caretPos.left}px,${caretPos.top}px,0)`,
                        }}
                    />
                    <div className="TypingArea__text" onClick={focusToInput} ref={textEl}>
                        {chars.map((c, i) => {
                            const isSpace = c.char === ' ' || c.char === '\n' || c.char === '\t';
                            let cls = 'char ';
                            if (c.isCorrect === true) cls += 'correct';
                            else if (c.isCorrect === false) cls += 'wrong';
                            else cls += 'pending';
                            if (i === index && !showResult) cls += ' current';
                            // 空格在错误时用背景块提示，避免看不见
                            if (c.isCorrect === false && isSpace) cls += ' char-space-wrong';
                            return (
                                <span className={cls} key={i}>
                                    {isSpace && c.char !== '\n' ? '\u00A0' : c.char}
                                </span>
                            );
                        })}
                    </div>
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
                    <div className="reload-line">
                        <ReloadBtn onClick={reload} />
                    </div>
                </Col>
            </Row>
            {showResult && (
                <Row justify="center" className="TypingArea__result">
                    <Col flex="900px">
                        <TypeResult
                            desc="WPM"
                            numStr={result.wpm}
                            acc={result.acc}
                            secs={result.secs}
                        />
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default TypingArea;
