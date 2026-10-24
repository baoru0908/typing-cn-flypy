/*
 * 代码打字练习：按语言选范例代码，交给通用打字引擎 TypingArea
 * 源码里的制表符由引擎展开为 4 空格，判定与显示保持一致
 * 每种语言有多个例子，换一题按钮在同语言内轮换
 */
import React, { useState, useCallback, useMemo } from 'react';
import { SwapOutlined } from '@ant-design/icons';

import './Code.less';
import TypingArea from '@/components/typingArea/TypingArea';
import { codeSnippets } from './snippets';

/** 按语言去重，保持原有出现顺序 */
const LANGS = Array.from(new Set(codeSnippets.map((s) => s.name)));

const pickOne = (name: string, exclude?: string) => {
    let pool = codeSnippets.filter((s) => s.name === name);
    if (pool.length > 1 && exclude) {
        const rest = pool.filter((s) => s.code !== exclude);
        if (rest.length) pool = rest;
    }
    const list = pool.length ? pool : codeSnippets;
    return list[Math.floor(Math.random() * list.length)].code;
};

const Code: React.FC = () => {
    const [lang, setLang] = useState(LANGS[0]);
    const [code, setCode] = useState(() => pickOne(LANGS[0]));

    const onLangChange = useCallback((name: string) => {
        setLang(name);
        setCode(pickOne(name));
    }, []);

    const onNext = useCallback(() => {
        setCode((prev) => pickOne(lang, prev));
    }, [lang]);

    const count = useMemo(() => codeSnippets.filter((s) => s.name === lang).length, [lang]);

    return (
        <div className="Code page">
            <div className="page__inner">
                <div className="page__toolbar">
                    <div className="chips chips--scroll">
                        <span className="chips__label">语言</span>
                        {LANGS.map((name) => (
                            <button
                                key={name}
                                type="button"
                                tabIndex={-1}
                                className={`chips__item ${lang === name ? 'is-active' : ''}`}
                                onClick={() => onLangChange(name)}
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                    <button type="button" tabIndex={-1} className="ghost-btn" onClick={onNext}>
                        <SwapOutlined />
                        换一题
                        <span className="ghost-btn__count">{count}</span>
                    </button>
                </div>
                <TypingArea text={code} expandTabs variant="code" />
            </div>
        </div>
    );
};

export default Code;
