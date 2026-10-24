/*
 * 英文打字练习：从语料库随机取一段，交给通用打字引擎 TypingArea
 * 短句/段落/长文三档，可在同档内换一段
 */
import React, { useState, useCallback, useMemo } from 'react';
import { SwapOutlined } from '@ant-design/icons';

import './English.less';
import TypingArea from '@/components/typingArea/TypingArea';
import { englishSentences } from './sentences';

const LEVELS = ['全部', 'short', 'medium', 'long'] as const;
type Level = (typeof LEVELS)[number];

const LEVEL_LABEL: Record<Level, string> = {
    全部: '全部',
    short: '短句',
    medium: '段落',
    long: '长文',
};

const poolOf = (level: Level) =>
    level === '全部' ? englishSentences : englishSentences.filter((s) => s.level === level);

const pickOne = (level: Level, exclude?: string) => {
    let pool = poolOf(level);
    if (pool.length > 1 && exclude) {
        const rest = pool.filter((s) => s.text !== exclude);
        if (rest.length) pool = rest;
    }
    return pool[Math.floor(Math.random() * pool.length)].text;
};

const English: React.FC = () => {
    const [level, setLevel] = useState<Level>('全部');
    const [text, setText] = useState(() => pickOne('全部'));

    const onLevelChange = useCallback((lv: Level) => {
        setLevel(lv);
        setText(pickOne(lv));
    }, []);

    const onNext = useCallback(() => {
        setText((prev) => pickOne(level, prev));
    }, [level]);

    const count = useMemo(() => poolOf(level).length, [level]);

    return (
        <div className="English page">
            <div className="page__inner">
                <div className="page__toolbar">
                    <div className="chips">
                        <span className="chips__label">长度</span>
                        {LEVELS.map((lv) => (
                            <button
                                key={lv}
                                type="button"
                                tabIndex={-1}
                                className={`chips__item ${level === lv ? 'is-active' : ''}`}
                                onClick={() => onLevelChange(lv)}
                            >
                                {LEVEL_LABEL[lv]}
                            </button>
                        ))}
                    </div>
                    <button type="button" tabIndex={-1} className="ghost-btn" onClick={onNext}>
                        <SwapOutlined />
                        换一段
                        <span className="ghost-btn__count">{count}</span>
                    </button>
                </div>
                <TypingArea text={text} variant="prose" />
            </div>
        </div>
    );
};

export default English;
