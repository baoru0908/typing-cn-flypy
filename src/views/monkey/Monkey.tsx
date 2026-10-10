import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Row, Col, Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';

import './Monkey.less';
import { storeConnect, MapState, MapDispatch } from '@/store/index';
import wordTool, { WordType } from '@/utils/wordTool';
import { getFlypy } from '@/utils/flypy';
import TypeResult from '@/components/typeResult/TypeResult';
import ReloadBtn from '@/components/reloadBtn/ReloadBtn';

interface LetterObj {
    letter: string;
    isCorrect: boolean | null;
}
interface WordObj extends WordType {
    letterArr: LetterObj[];
    isCorrect: boolean | null;
    isSkip: boolean;
}

const SPACE_CODE = 32;
const BACKSPACE_CODE = 8;

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
    const [caretLocation, setCaretLocation] = useState({ top: 0, left: 0 });
    const [wordCount, setWordCount] = useState(30);

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
        if (currentLetterArr.length <= coordinate[1]) {
            const letterRect = currentLetterArr[coordinate[1] - 1].getBoundingClientRect();
            setCaretLocation({
                top: letterRect.top - mainElRect.top + 2,
                left: letterRect.left - mainElRect.left + letterRect.width,
            });
        } else {
            const letterRect = currentLetterArr[coordinate[1]].getBoundingClientRect();
            setCaretLocation({
                top: letterRect.top - mainElRect.top + 2,
                left: letterRect.left - mainElRect.left,
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
                    currentWordEl.appendChild(codeEl);
                }
                newCoordinate = [coordinate[0], coordinate[1] + 1];
            }
            coordinateRef.current = newCoordinate;
            setCaret();

            setWordArr((_wordArr) => {
                const letterObj = _wordArr[coordinate[0]].letterArr[coordinate[1]];
                if (letterObj && keyCode !== SPACE_CODE) {
                    // console.log(inputVal === letterObj.letter, letterObj);
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
                currentWordEl.removeChild(extraLetterArr[extraLetterArr.length - 1]);
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
        // console.log(evt.key, evt.keyCode, evt.metaKey);
        // 9: Tab
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
            if (
                inputMode === '2' &&
                curWord &&
                coord[1] >= curWord.letterArr.length
            ) {
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
                return Object.assign({}, word, {
                    letterArr: Array.from(getWordCodeText(word)).map((letter) => ({
                        letter,
                        isCorrect: null,
                    })),
                    isCorrect: null,
                    isSkip: false,
                });
            })
        );
        setUserInput('');
        setIsFadingTypeMain(false);
        setShowTypeResult(false);
        setTimeout(() => {
            focusToInput();
            setCaret();
        }, 10);
    }, [wordCount, getWordCodeText]);

    useEffect(() => {
        wordsBaseRef.current = wordTool.getWords(
            props.$state.root.wordsMode,
            props.$state.root.customerWords
        );
        reloadWord();
    }, [props.$state.root.wordsMode, props.$state.root.customerWords, reloadWord, wordCount]);

    return (
        <div className="Monkey">
            <div className="word-count-radio">
                <Radio.Group
                    value={wordCount}
                    size="small"
                    onChange={(e: RadioChangeEvent) => {
                        setWordCount(e.target.value);
                    }}
                >
                    <Radio.Button tabIndex={-1} value={20}>
                        20
                    </Radio.Button>
                    <Radio.Button tabIndex={-1} value={30}>
                        30
                    </Radio.Button>
                    <Radio.Button tabIndex={-1} value={40}>
                        40
                    </Radio.Button>
                    <Radio.Button tabIndex={-1} value={50}>
                        50
                    </Radio.Button>
                </Radio.Group>
            </div>
            <Row justify="center" align="middle">
                <Col
                    flex="900px"
                    className={`type-main-box ${isFadingTypeMain ? 'fading' : ''} ${
                        showTypeResult ? 'hide' : ''
                    }`}
                >
                    <div
                        className={`caret ${isTyping ? (isCaretFlash ? 'flash' : '') : 'hide'}`}
                        ref={caretElRef}
                        style={{
                            transform: `translate3d(${caretLocation.left}px,${caretLocation.top}px,0)`,
                        }}
                    ></div>
                    <div className="words-box" onClick={focusToInput} ref={mainEl}>
                        {wordArr.map((word, wi) => (
                            <div
                                className={`word ${
                                    word.isCorrect
                                        ? 'correct'
                                        : word.isCorrect === false
                                        ? 'wrong'
                                        : ''
                                }`}
                                key={wi}
                            >
                                <div className="label">{word.label}</div>
                                {word.letterArr?.map((letterObj, li) => (
                                    <code
                                        className={`letter ${
                                            letterObj.isCorrect
                                                ? 'correct'
                                                : letterObj.isCorrect === false
                                                ? 'wrong'
                                                : ''
                                        }`}
                                        key={`${wi}_${li}`}
                                    >
                                        {letterObj.letter}
                                    </code>
                                ))}
                            </div>
                        ))}
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
                            // setIsCaretFlash(false);
                        }}
                        onFocus={() => {
                            setIsTyping(true);
                            setIsCaretFlash(true);
                        }}
                    />
                    <div className="reload-line">
                        <ReloadBtn onClick={reloadWord} />
                    </div>
                    {/* {userInput} */}
                    <div className={`tip-line ${!isCaretFlash ? 'hide' : ''}`}>
                        <div>点击词块进入输入状态</div>
                        <div>
                            {inputMode === '2'
                                ? '输入小鹤双拼编码，打满自动上词（空格也可上词）'
                                : '输入正确的拼音字母，然后空格'}
                        </div>
                        <div>
                            输入状态下<code>Tab</code>后回车可以直接刷新
                        </div>
                        <div>觉得有意思可以打赏一下(#^.^#)(在上面↑↑)</div>
                    </div>
                </Col>
                <Col flex="900px" className={`type-result-box ${showTypeResult ? 'show' : ''}`}>
                    {/* {JSON.stringify(typeResultRef.current)} */}
                    <TypeResult
                        desc="WPM"
                        numStr={typeResultRef.current.wpm}
                        acc={typeResultRef.current.acc}
                        secs={typeResultRef.current.time.secs}
                    />
                    <div className="reload-line">
                        <ReloadBtn onClick={reloadWord} />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default storeConnect(Monkey);
