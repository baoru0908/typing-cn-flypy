import React, { useState, useEffect, useRef, useCallback } from 'react';

import './Monkey.less';
import { storeConnect, MapState, MapDispatch } from '@/store/index';
import wordTool, { WordType } from '@/utils/wordTool';
import { getFlypy } from '@/utils/flypy';
import { buildCharGroups, CharGroup } from '@/utils/codeGroup';
import TypeResult from '@/components/typeResult/TypeResult';
import ReloadBtn from '@/components/reloadBtn/ReloadBtn';
import StatBar from '@/components/statBar/StatBar';

interface LetterObj {
    letter: string;
    isCorrect: boolean | null;
}
interface WordObj extends WordType {
    letterArr: LetterObj[];
    /** 一字一组：汉字 + 该字对应的编码，用于逐字对齐 */
    charGroups: CharGroup[];
    isCorrect: boolean | null;
    isSkip: boolean;
}

const SPACE_CODE = 32;
const BACKSPACE_CODE = 8;
const WORD_COUNTS = [20, 30, 40, 50];

const getCurrentWordEl = (mEl: any) => Array.from<any>(mEl.children);

const Monkey: React.FC<MapState & MapDispatch> = (props) => {
    const inputEl = useRef(null);
    const mainEl = useRef(null);
    const caretElRef = useRef(null);
    const wordsBaseRef = useRef(
        wordTool.getWords(props.$state.root.wordsMode, props.$state.root.customerWords)
    );
    const coordinateRef = useRef([0, 0]);
    const typeResultRef = useRef({
        wpm: '',
        right: 0,
        wrong: 0,
        acc: 0,
        time: { begin: 0, secs: 0 },
    });

    const [isTyping, setIsTyping] = useState(false);
    const [isCaretFlash, setIsCaretFlash] = useState(false);
    const [isFadingTypeMain, setIsFadingTypeMain] = useState(false);
    const [showTypeResult, setShowTypeResult] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [wordArr, setWordArr] = useState<Array<WordObj>>([]);
    const [caretLocation, setCaretLocation] = useState({ top: 0, left: 0, height: 18 });
    const [wordCount, setWordCount] = useState(30);
    const [liveSecs, setLiveSecs] = useState(0);

    // 输入方案: 1-全拼 2-小鹤双拼
    const inputMode = props.$state.root.inputMode;
    // 词组的目标编码：全拼取词库 text，小鹤双拼按词组逐字转换
    const getWordCodeText = useCallback(
        (word: WordType) => {
            return inputMode === '2' ? getFlypy(word.label) : word.text;
        },
        [inputMode]
    );

    const setCaret = () => {
        const coordinate = coordinateRef.current; // 此时坐标为下一个字母的坐标
        const mainElRect = (mainEl.current as any).getBoundingClientRect();
        const currentWordEl = getCurrentWordEl(mainEl.current)[coordinate[0]];
        if (!currentWordEl) return;
        const currentLetterArr = Array.from<any>(currentWordEl.getElementsByClassName('letter'));
        if (currentLetterArr.length === 0) return;
        if (currentLetterArr.length <= coordinate[1]) {
            const letterRect = currentLetterArr[coordinate[1] - 1].getBoundingClientRect();
            setCaretLocation({
                top: letterRect.top - mainElRect.top,
                left: letterRect.left - mainElRect.left + letterRect.width,
                height: letterRect.height + 2,
            });
        } else {
            const letterRect = currentLetterArr[coordinate[1]].getBoundingClientRect();
            setCaretLocation({
                top: letterRect.top - mainElRect.top,
                left: letterRect.left - mainElRect.left,
                height: letterRect.height + 2,
            });
        }
    };

    const inputForwardFunc = useCallback(
        (keyCode: number, inputVal: string) => {
            const coordinate = coordinateRef.current;
            // 越界保护：结果已弹出/词组已打完时忽略后续按键
            if (!wordArr[coordinate[0]]) return;
            // 是否真正执行了空格上词
            let spaceCommit = false;
            let newCoordinate: number[];
            if (keyCode === SPACE_CODE) {
                if (inputMode === '2') {
                    // 小鹤双拼：编码打满才上词；未打满的空格一律忽略，
                    // 防止误触空格把当前词/下一个词跳过判错
                    if (coordinate[1] >= wordArr[coordinate[0]].letterArr.length) {
                        spaceCommit = true;
                        newCoordinate = [coordinate[0] + 1, 0];
                    } else {
                        newCoordinate = coordinate;
                    }
                } else {
                    const isNewWordInputing =
                        userInput === '' || userInput.charAt(userInput.length - 1) === ' ';
                    if (isNewWordInputing) {
                        newCoordinate = coordinate;
                    } else {
                        spaceCommit = true;
                        newCoordinate = [coordinate[0] + 1, 0];
                    }
                }
            } else {
                if (coordinate[1] >= wordArr[coordinate[0]].letterArr.length) {
                    // 已经是单词最后一位（下标等于长度），却输入了字母
                    const currentWordEl = getCurrentWordEl(mainEl.current)[coordinate[0]];
                    const codeEl = document.createElement('code');
                    codeEl.className = 'letter wrong extra-letter';
                    codeEl.innerText = inputVal;
                    // 多打的字母要接在编码行末尾，不能挂到词根上（否则会多出一行）
                    const codeLine = currentWordEl.querySelector('.word__code') || currentWordEl;
                    codeLine.appendChild(codeEl);
                }
                newCoordinate = [coordinate[0], coordinate[1] + 1];
            }
            coordinateRef.current = newCoordinate;
            setCaret();

            setWordArr((_wordArr) => {
                const letterObj = _wordArr[coordinate[0]].letterArr[coordinate[1]];
                if (letterObj && keyCode !== SPACE_CODE) {
                    letterObj.isCorrect = inputVal === letterObj.letter;
                    _wordArr[coordinate[0]].letterArr[coordinate[1]] = letterObj;
                }
                if (spaceCommit) {
                    // 空格上词：未输入完的词组按跳过处理（仅全拼模式会出现）
                    if (_wordArr[coordinate[0]].letterArr.some((l) => l.isCorrect === null)) {
                        _wordArr[coordinate[0]].isSkip = true;
                        _wordArr[coordinate[0]].isCorrect = false;
                    } else {
                        const currentWordEl = getCurrentWordEl(mainEl.current)[coordinate[0]];
                        const extraLetterArr = currentWordEl.getElementsByClassName('extra-letter');
                        if (!extraLetterArr || extraLetterArr.length === 0) {
                            _wordArr[coordinate[0]].isCorrect = _wordArr[
                                coordinate[0]
                            ].letterArr.every((l) => l.isCorrect);
                        } else {
                            _wordArr[coordinate[0]].isCorrect = false;
                        }
                    }
                }

                // 是否 (新坐标已超出词组数) || (最后一个词、最后一个字母), 判断显示结果
                if (
                    newCoordinate[0] > _wordArr.length - 1 ||
                    (coordinate[0] === _wordArr.length - 1 &&
                        coordinate[1] === _wordArr[coordinate[0]].letterArr.length - 1)
                ) {
                    _wordArr[coordinate[0]].isCorrect = _wordArr[coordinate[0]].letterArr.every(
                        (l) => l.isCorrect
                    );
                    typeResultRef.current.right = _wordArr.filter((w) => w.isCorrect).length;
                    typeResultRef.current.wrong = _wordArr.length - typeResultRef.current.right;
                    typeResultRef.current.acc = Math.round(
                        (typeResultRef.current.right /
                            (typeResultRef.current.right + typeResultRef.current.wrong)) *
                            100
                    );
                    typeResultRef.current.time.secs = Math.round(
                        (Date.now() - typeResultRef.current.time.begin) / 1000
                    );
                    typeResultRef.current.wpm = (
                        typeResultRef.current.right /
                        (typeResultRef.current.time.secs / 60)
                    ).toFixed(2);
                    setIsTyping(false);
                    setIsFadingTypeMain(true);
                    setTimeout(() => {
                        setShowTypeResult(true);
                    }, 150);
                }
                return _wordArr;
            });
            setUserInput((v) => {
                if (keyCode === SPACE_CODE) {
                    // 未真正上词的空格不记录到输入
                    if (!spaceCommit || v === '' || v.charAt(v.length - 1) === ' ') {
                        return v;
                    }
                }
                return v + inputVal;
            });
        },
        [userInput, wordArr, inputMode]
    );
    const backspaceFunc = useCallback(() => {
        const deleteChar = userInput.charAt(userInput.length - 1);
        if (deleteChar === '') {
            return;
        }
        const coordinate = coordinateRef.current;
        // 越界保护：结果已弹出时忽略退格
        if (!wordArr[coordinate[0]] && deleteChar !== ' ') {
            return;
        }
        let newCoordinate;
        if (deleteChar === ' ') {
            if (wordArr[coordinate[0] - 1].isCorrect) {
                newCoordinate = coordinate;
            } else {
                if (wordArr[coordinate[0] - 1].isSkip) {
                    const lIndex = wordArr[coordinate[0] - 1].letterArr.findIndex(
                        (l) => l.isCorrect === null
                    );
                    newCoordinate = [coordinate[0] - 1, lIndex];
                } else {
                    const currentWordEl = getCurrentWordEl(mainEl.current)[coordinate[0] - 1];
                    const currentLetterArr = currentWordEl.getElementsByClassName('letter');
                    newCoordinate = [coordinate[0] - 1, currentLetterArr.length];
                }
            }
        } else {
            const currentWordEl = getCurrentWordEl(mainEl.current)[coordinate[0]];
            const extraLetterArr = currentWordEl.getElementsByClassName('extra-letter');
            if (extraLetterArr && extraLetterArr.length > 0) {
                extraLetterArr[extraLetterArr.length - 1].remove();
            }
            newCoordinate = [coordinate[0], coordinate[1] - 1];
        }
        coordinateRef.current = newCoordinate;
        setCaret();
        setWordArr((_wordArr) => {
            if (deleteChar === ' ') {
                if (_wordArr[coordinate[0] - 1].isCorrect === false) {
                    _wordArr[coordinate[0] - 1].isCorrect = null;
                }
            } else if (_wordArr[coordinate[0]].letterArr.length >= coordinate[1]) {
                _wordArr[coordinate[0]].letterArr[coordinate[1] - 1].isCorrect = null;
                _wordArr[coordinate[0]].isCorrect = null;
            }
            return _wordArr;
        });
        setUserInput((v) => {
            let canDelete = true;
            if (deleteChar === ' ') {
                if (wordArr[coordinate[0] - 1].isCorrect) {
                    canDelete = false;
                }
            }
            return canDelete ? v.substring(0, v.length - 1) : v;
        });
    }, [userInput, wordArr]);

    const inputKeyDown = (evt: React.KeyboardEvent) => {
        // 9: Tab 保留给浏览器切焦点，其余按键接管
        if (evt.keyCode !== 9) {
            evt.preventDefault();
            evt.stopPropagation();
            evt.persist();
        }
        if (showTypeResult) {
            return;
        }
        setIsCaretFlash(false);
        if (evt.key.length === 1) {
            if (typeResultRef.current.time.begin === 0) {
                typeResultRef.current.time.begin = Date.now();
            }
            // 小鹤双拼：词组编码固定 4 键，打满后再输入字母时自动上词（等同空格），
            // 避免字母被当作多余字母插入当前词的显示区
            const coord = coordinateRef.current;
            const curWord = wordArr[coord[0]];
            if (inputMode === '2' && curWord && coord[1] >= curWord.letterArr.length) {
                inputForwardFunc(SPACE_CODE, ' ');
            }
            inputForwardFunc(evt.keyCode, evt.key);
        } else if (evt.keyCode === BACKSPACE_CODE) {
            backspaceFunc();
        }
    };

    const focusToInput = () => {
        setIsTyping(true);
        (inputEl.current as any).focus();
    };

    const reloadWord = useCallback(() => {
        coordinateRef.current = [0, 0];
        wordsBaseRef.current = wordTool.shuffle(wordsBaseRef.current);
        typeResultRef.current = {
            wpm: '',
            right: 0,
            wrong: 0,
            acc: 0,
            time: { begin: 0, secs: 0 },
        };
        const extraLetterArr = (mainEl.current as any).getElementsByClassName('extra-letter');
        if (extraLetterArr.length !== 0) {
            Array.from<any>(extraLetterArr).forEach((etl) => {
                etl.parentNode.removeChild(etl);
            });
        }
        setWordArr(
            wordTool.jsonCopy<WordType[]>(wordsBaseRef.current.slice(0, wordCount)).map((word) => {
                const codeText = getWordCodeText(word);
                return Object.assign({}, word, {
                    letterArr: Array.from(codeText).map((letter) => ({
                        letter,
                        isCorrect: null,
                    })),
                    charGroups: buildCharGroups(word.label, codeText, inputMode),
                    isCorrect: null,
                    isSkip: false,
                });
            })
        );
        setUserInput('');
        setLiveSecs(0);
        setIsFadingTypeMain(false);
        setShowTypeResult(false);
        setTimeout(() => {
            focusToInput();
            setCaret();
        }, 10);
    }, [wordCount, getWordCodeText, inputMode]);

    useEffect(() => {
        wordsBaseRef.current = wordTool.getWords(
            props.$state.root.wordsMode,
            props.$state.root.customerWords
        );
        reloadWord();
    }, [props.$state.root.wordsMode, props.$state.root.customerWords, reloadWord, wordCount]);

    // 输入过程中刷新计时
    useEffect(() => {
        if (!isTyping || showTypeResult) return undefined;
        const timer = window.setInterval(() => {
            const begin = typeResultRef.current.time.begin;
            if (!begin) return;
            setLiveSecs(Math.max(1, Math.round((Date.now() - begin) / 1000)));
        }, 400);
        return () => window.clearInterval(timer);
    }, [isTyping, showTypeResult]);

    /* ---------------- 实时统计 ---------------- */
    const allLetters = wordArr.reduce<LetterObj[]>((acc, word) => acc.concat(word.letterArr), []);
    const typedLetters = allLetters.filter((l) => l.isCorrect !== null);
    const rightLetters = allLetters.filter((l) => l.isCorrect === true);
    const liveAcc = typedLetters.length
        ? Math.round((rightLetters.length / typedLetters.length) * 100)
        : 100;
    const rightWords = wordArr.filter((w) => w.isCorrect === true).length;
    const liveWpm = liveSecs > 0 ? Math.round(rightWords / (liveSecs / 60)) : 0;
    const mm = Math.floor(liveSecs / 60);
    const ss = String(liveSecs % 60).padStart(2, '0');

    const activeWordIndex = coordinateRef.current[0];
    const tipText =
        inputMode === '2'
            ? '两键一字，打满自动上词 · 空格也可上词'
            : '输入完整拼音后按空格上词';

    return (
        <div className="Monkey page">
            <div className="page__inner">
                <div className="page__toolbar">
                    <div className="seg seg--sm" role="group" aria-label="输入方案">
                        <button
                            type="button"
                            tabIndex={-1}
                            className={inputMode === '1' ? 'is-active' : ''}
                            onClick={() => props.$dispatch('setInputMode', '1')}
                            title="全拼：输入完整拼音后按空格上词"
                        >
                            全拼
                        </button>
                        <button
                            type="button"
                            tabIndex={-1}
                            className={inputMode === '2' ? 'is-active' : ''}
                            onClick={() => props.$dispatch('setInputMode', '2')}
                            title="小鹤双拼：两键一字，打满自动上词"
                        >
                            双拼
                        </button>
                    </div>
                    <div className="chips">
                        <span className="chips__label">词数</span>
                        {WORD_COUNTS.map((count) => (
                            <button
                                key={count}
                                type="button"
                                tabIndex={-1}
                                className={`chips__item ${wordCount === count ? 'is-active' : ''}`}
                                onClick={() => setWordCount(count)}
                            >
                                {count}
                            </button>
                        ))}
                    </div>
                    <span className="chips__note">{tipText}</span>
                    <div className="page__toolbar-right">
                        <StatBar
                            active={typedLetters.length > 0}
                            items={[
                                { label: 'WPM', value: liveWpm },
                                { label: '准确率', value: `${liveAcc}%` },
                                { label: '用时', value: `${mm}:${ss}` },
                            ]}
                        />
                    </div>
                </div>

                <div
                    className={`Monkey__stage ${isFadingTypeMain ? 'is-fading' : ''} ${
                        showTypeResult ? 'is-hidden' : ''
                    }`}
                >
                    <div className="Monkey__panel" onClick={focusToInput}>
                        <div className="Monkey__typebox">
                            <div className="words-box" ref={mainEl}>
                                {wordArr.map((word, wi) => {
                                    const isActive = wi === activeWordIndex && !showTypeResult;
                                    // 两条行各自按 charGroups 顺序取字母/汉字
                                    let codeOffset = 0;
                                    let offset = 0;
                                    return (
                                        <div
                                            className={`word ${
                                                word.isCorrect
                                                    ? 'is-correct'
                                                    : word.isCorrect === false
                                                    ? 'is-wrong'
                                                    : ''
                                            } ${isActive ? 'is-active' : ''}`}
                                            key={wi}
                                        >
                                            {/* 编码行：等宽连续排列，音节之间用恒定的 2px 断开。
                                                不做逐字定宽盒子 —— 那会让短码凭空多出留白，
                                                码流空隙忽大忽小（旧版 0/4/6/8px 混杂） */}
                                            <div className="word__code">
                                                {word.charGroups.map((group, gi) => {
                                                    const letters = word.letterArr.slice(
                                                        codeOffset,
                                                        codeOffset + group.code.length
                                                    );
                                                    codeOffset += group.code.length;
                                                    return (
                                                        <span
                                                            className="code-group"
                                                            key={`${wi}_c${gi}`}
                                                        >
                                                            {letters.map((letterObj, li) => (
                                                                <code
                                                                    className={`letter ${
                                                                        letterObj.isCorrect
                                                                            ? 'correct'
                                                                            : letterObj.isCorrect ===
                                                                              false
                                                                            ? 'wrong'
                                                                            : ''
                                                                    }`}
                                                                    key={`${wi}_${gi}_${li}`}
                                                                >
                                                                    {letterObj.letter}
                                                                </code>
                                                            ))}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                            {/* 汉字行：统一步进，词内字距与拼音长度彻底解耦 */}
                                            <div className="word__hanzi">
                                                {word.charGroups.map((group, gi) => {
                                                    const letters = word.letterArr.slice(
                                                        offset,
                                                        offset + group.code.length
                                                    );
                                                    offset += group.code.length;
                                                    const done =
                                                        letters.length > 0 &&
                                                        letters.every(
                                                            (l) => l.isCorrect === true
                                                        );
                                                    const bad = letters.some(
                                                        (l) => l.isCorrect === false
                                                    );
                                                    return (
                                                        <span
                                                            className={`hanzi ${
                                                                done ? 'is-done' : ''
                                                            } ${bad ? 'is-bad' : ''}`}
                                                            key={`${wi}_h${gi}`}
                                                        >
                                                            {group.hanzi}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div
                                className={`caret ${
                                    isTyping ? (isCaretFlash ? 'flash' : '') : 'hide'
                                }`}
                                ref={caretElRef}
                                style={{
                                    transform: `translate3d(${caretLocation.left}px,${caretLocation.top}px,0)`,
                                    height: `${caretLocation.height}px`,
                                }}
                            />
                        </div>
                    </div>

                    <div className="Monkey__foot">
                        <span className="Monkey__tip">
                            点击词块开始 · <code>Backspace</code> 可退格修正
                        </span>
                        <ReloadBtn onClick={reloadWord} label="换一组" />
                    </div>
                </div>

                <div className={`Monkey__result ${showTypeResult ? 'is-shown' : ''}`}>
                    <TypeResult
                        desc="WPM"
                        numStr={typeResultRef.current.wpm}
                        acc={typeResultRef.current.acc}
                        secs={typeResultRef.current.time.secs}
                    />
                </div>

                <input
                    className="hidden-input"
                    type="text"
                    ref={inputEl}
                    onKeyDown={inputKeyDown}
                    /* readOnly：输入框不可编辑，系统输入法(IME)不会在上面启动组词，
                       避免拼音输入法拦截按键/弹出候选窗等 bug；keydown 事件照常触发 */
                    onCompositionStart={(evt) => evt.preventDefault()}
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    readOnly
                    onBlur={() => {
                        setIsTyping(false);
                    }}
                    onFocus={() => {
                        setIsTyping(true);
                        setIsCaretFlash(true);
                    }}
                />
            </div>
        </div>
    );
};

export default storeConnect(Monkey);
