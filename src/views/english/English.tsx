/*
 * 英文打字练习：从语料库随机取一句，交给通用打字引擎 TypingArea
 */
import React, { useState, useCallback } from 'react';
import { Radio } from 'antd';

import './English.less';
import TypingArea from '@/components/typingArea/TypingArea';
import { englishSentences } from './sentences';

const LEVELS = ['全部', 'short', 'medium', 'long'] as const;
type Level = (typeof LEVELS)[number];

const pickOne = (level: Level) => {
    const pool =
        level === '全部' ? englishSentences : englishSentences.filter((s) => s.level === level);
    return pool[Math.floor(Math.random() * pool.length)].text;
};

const English: React.FC = () => {
    const [level, setLevel] = useState<Level>('全部');
    const [text, setText] = useState(() => pickOne('全部'));

    const onLevelChange = useCallback((lv: Level) => {
        setLevel(lv);
        setText(pickOne(lv));
    }, []);

    return (
        <div className="English">
            <div className="word-count-radio">
                <Radio.Group
                    value={level}
                    size="small"
                    onChange={(e) => onLevelChange(e.target.value as Level)}
                >
                    {LEVELS.map((lv) => (
                        <Radio.Button tabIndex={-1} key={lv} value={lv}>
                            {lv === 'short'
                                ? '短句'
                                : lv === 'medium'
                                ? '中句'
                                : lv === 'long'
                                ? '长句'
                                : '全部'}
                        </Radio.Button>
                    ))}
                </Radio.Group>
            </div>
            <TypingArea text={text} />
        </div>
    );
};

export default English;
