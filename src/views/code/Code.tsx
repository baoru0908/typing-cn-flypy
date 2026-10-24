/*
 * 代码打字练习：按语言选范例代码，交给通用打字引擎 TypingArea
 * 源码里的制表符由引擎展开为 4 空格，判定与显示保持一致
 */
import React, { useState, useCallback } from 'react';
import { Radio } from 'antd';

import './Code.less';
import TypingArea from '@/components/typingArea/TypingArea';
import { codeSnippets } from './snippets';

const pickOne = (name: string) => {
    const pool = codeSnippets.filter((s) => s.name === name);
    const list = pool.length ? pool : codeSnippets;
    return list[Math.floor(Math.random() * list.length)].code;
};

const Code: React.FC = () => {
    const [lang, setLang] = useState(codeSnippets[0].name);
    const [code, setCode] = useState(() => pickOne(codeSnippets[0].name));

    const onLangChange = useCallback((name: string) => {
        setLang(name);
        setCode(pickOne(name));
    }, []);

    return (
        <div className="Code">
            <div className="code-lang-radio">
                <Radio.Group
                    value={lang}
                    size="small"
                    onChange={(e) => onLangChange(e.target.value)}
                >
                    {codeSnippets.map((s) => (
                        <Radio.Button tabIndex={-1} key={s.name} value={s.name}>
                            {s.name}
                        </Radio.Button>
                    ))}
                </Radio.Group>
            </div>
            <TypingArea text={code} expandTabs />
        </div>
    );
};

export default Code;
