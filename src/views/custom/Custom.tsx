/*
 * 自定义文本打字练习：文本存 localStorage，刷新不丢
 * 中文占比高的文本自动切到中文排版变体（更大的字距与行距）
 */
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Input } from 'antd';

import './Custom.less';
import TypingArea from '@/components/typingArea/TypingArea';
import storage from '@/utils/storage';

const STORAGE_KEY = 'CUSTOM_TYPE_TEXT';
const DEFAULT_TEXT = '在此输入想要练习的文本，支持中英文与换行。';

const Custom: React.FC = () => {
    const [text, setText] = useState(() => storage.local.get<string>(STORAGE_KEY) || DEFAULT_TEXT);
    const [editing, setEditing] = useState('');

    useEffect(() => {
        setEditing(text);
    }, [text]);

    const onBlur = useCallback(() => {
        const val = editing.trim();
        if (val && val !== text) {
            setText(val);
            storage.local.set(STORAGE_KEY, val);
        } else {
            setEditing(text);
        }
    }, [editing, text]);

    // 中文为主的文本用中文排版（字距 0.02em、行距 1.9）
    const variant = useMemo(() => {
        const cjk = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
        const total = text.replace(/\s/g, '').length || 1;
        return cjk / total > 0.5 ? 'cn' : 'prose';
    }, [text]);

    return (
        <div className="Custom page">
            <div className="page__inner">
                <div className="page__toolbar">
                    <div className="chips">
                        <span className="chips__label">练习文本</span>
                    </div>
                    <span className="chips__note">保存在本地，下次打开自动恢复</span>
                </div>
                <div className="Custom__editor">
                    <Input.TextArea
                        autoSize={{ minRows: 3, maxRows: 8 }}
                        value={editing}
                        onChange={(e) => setEditing(e.target.value)}
                        onBlur={onBlur}
                        placeholder="输入自定义文本，失焦后生效"
                    />
                </div>
                <TypingArea text={text} variant={variant} />
            </div>
        </div>
    );
};

export default Custom;
