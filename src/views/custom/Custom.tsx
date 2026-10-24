/*
 * 自定义文本打字练习：文本存 localStorage，刷新不丢
 */
import React, { useState, useCallback, useEffect } from 'react';
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

    return (
        <div className="Custom">
            <div className="custom-tip">文本保存在本地，下次打开自动恢复</div>
            <div className="custom-input-line">
                <Input.TextArea
                    autoSize={{ minRows: 3, maxRows: 8 }}
                    value={editing}
                    onChange={(e) => setEditing(e.target.value)}
                    onBlur={onBlur}
                    placeholder="输入自定义文本，失焦后生效"
                />
            </div>
            <TypingArea text={text} variant="prose" />
        </div>
    );
};

export default Custom;
