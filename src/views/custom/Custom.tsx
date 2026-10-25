/*
 * 自定义文本打字练习
 * - 输入即生效（800ms 防抖，打字区与编辑器焦点互斥，不会打断练习）
 * - 可把常用文本保存成多段随时切换（存 localStorage）
 * - 中文占比高的文本自动切到中文排版变体（更大的字距与行距）
 */
import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Input, Dropdown, Menu, message } from 'antd';
import { DeleteOutlined, DownOutlined, SaveOutlined, ClearOutlined } from '@ant-design/icons';

import './Custom.less';
import TypingArea, { TypingVariant } from '@/components/typingArea/TypingArea';
import storage from '@/utils/storage';

const STORAGE_KEY = 'CUSTOM_TYPE_TEXT';
const LIST_KEY = 'CUSTOM_TYPE_LIST';
/** 常用文本最多存几段：编辑器是全量渲染的，段数本身不占资源，但列表太长难翻 */
const LIST_LIMIT = 10;
/** 输入停顿多久后生效 */
const APPLY_DELAY = 800;

const DEFAULT_TEXT = '在此输入想要练习的文本，支持中英文与换行。';

interface SavedText {
    id: string;
    text: string;
    ts: number;
}

const loadList = (): SavedText[] => storage.local.get<SavedText[]>(LIST_KEY) || [];

const saveList = (list: SavedText[]) => storage.local.set(LIST_KEY, list);

/** 列表条目名：取首行前 14 个字符 */
const nameOf = (text: string) => {
    const head = text.split('\n')[0].trim();
    return head.length > 14 ? `${head.slice(0, 14)}…` : head || '（空）';
};

const Custom: React.FC = () => {
    // 从未存过 → 给默认示例文本；显式清空过（存了 ''）→ 尊重空态，不弹回示例
    const stored = storage.local.get<string>(STORAGE_KEY);
    const [text, setText] = useState(() =>
        stored === null || stored === undefined ? DEFAULT_TEXT : stored
    );
    const [editing, setEditing] = useState(text);
    const [list, setList] = useState<SavedText[]>(loadList);

    const timerRef = useRef(0);
    const areaRef = useRef<any>(null);

    useEffect(
        () => () => {
            window.clearTimeout(timerRef.current);
        },
        []
    );

    /** 输入即生效：防抖后同步到打字区与本地存储。空文本不生效，避免打字区空转 */
    const onEditingChange = useCallback(
        (val: string) => {
            setEditing(val);
            window.clearTimeout(timerRef.current);
            timerRef.current = window.setTimeout(() => {
                const next = val.trim();
                if (!next) return;
                setText((prev) => {
                    if (prev === next) return prev;
                    storage.local.set(STORAGE_KEY, next);
                    return next;
                });
            }, APPLY_DELAY);
        },
        []
    );

    const saveToLibrary = useCallback(() => {
        const content = editing.trim();
        if (!content) {
            message.warning('先输入内容再保存');
            return;
        }
        setList((prev) => {
            const rest = prev.filter((it) => it.text !== content);
            const next = [{ id: Date.now().toString(36), text: content, ts: Date.now() }, ...rest];
            if (next.length > LIST_LIMIT) next.length = LIST_LIMIT;
            saveList(next);
            return next;
        });
        message.success('已保存到我的文本');
    }, [editing]);

    const switchTo = useCallback((item: SavedText) => {
        window.clearTimeout(timerRef.current);
        setEditing(item.text);
        setText(item.text);
        storage.local.set(STORAGE_KEY, item.text);
    }, []);

    const removeFrom = useCallback(
        (id: string) => {
            setList((prev) => {
                const next = prev.filter((it) => it.id !== id);
                saveList(next);
                return next;
            });
        },
        []
    );

    /** 清空 = 编辑器与打字区一起清（显式操作，不受「空文本不生效」守卫拦截） */
    const clearEditing = useCallback(() => {
        window.clearTimeout(timerRef.current);
        setEditing('');
        setText('');
        storage.local.set(STORAGE_KEY, '');
        areaRef.current?.focus();
    }, []);

    // 中文为主的文本用中文排版（字距 0.02em、行距 1.9）
    const { variant, charCount } = useMemo<{
        variant: TypingVariant;
        charCount: number;
    }>(() => {
        const cjk = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
        const total = text.replace(/\s/g, '').length;
        return {
            variant: total && cjk / total > 0.5 ? 'cn' : 'prose',
            charCount: total,
        };
    }, [text]);

    const libraryMenu = (
        <Menu
            className="Custom__menu"
            onClick={({ key }) => {
                const item = list.find((it) => it.id === key);
                if (item) switchTo(item);
            }}
        >
            {list.length === 0 && <Menu.Item disabled>还没有保存的文本</Menu.Item>}
            {list.map((item) => (
                <Menu.Item key={item.id} title={item.text.split('\n')[0]}>
                    <span className="Custom__menu-name">{nameOf(item.text)}</span>
                    <span
                        className="Custom__menu-del"
                        role="button"
                        aria-label="删除"
                        onClick={(e) => {
                            e.stopPropagation();
                            removeFrom(item.id);
                        }}
                    >
                        <DeleteOutlined />
                    </span>
                </Menu.Item>
            ))}
        </Menu>
    );

    return (
        <div className="Custom page">
            <div className="page__inner">
                <div className="page__toolbar">
                    <div className="chips">
                        <span className="chips__label">练习文本</span>
                        <span className="chips__meta">
                            {charCount} 字 · {variant === 'cn' ? '中文排版' : '英文排版'}
                        </span>
                    </div>
                    <div className="Custom__actions">
                        <button
                            type="button"
                            tabIndex={-1}
                            className="ghost-btn"
                            onClick={saveToLibrary}
                        >
                            <SaveOutlined />
                            存为常用
                        </button>
                        <Dropdown trigger={['click']} overlay={libraryMenu}>
                            <button type="button" tabIndex={-1} className="ghost-btn">
                                我的文本
                                <span className="ghost-btn__count">{list.length}</span>
                                <DownOutlined className="Custom__caret-down" />
                            </button>
                        </Dropdown>
                    </div>
                </div>
                <div className="Custom__editor">
                    <Input.TextArea
                        ref={areaRef}
                        autoSize={{ minRows: 3, maxRows: 8 }}
                        value={editing}
                        onChange={(e) => onEditingChange(e.target.value)}
                        placeholder="输入自定义文本，停顿一下即生效"
                        onKeyDown={(e) => {
                            // Esc 离开编辑器，回到打字
                            if (e.keyCode === 27) {
                                e.preventDefault();
                                (e.target as HTMLTextAreaElement).blur();
                            }
                        }}
                    />
                    <div className="Custom__editor-foot">
                        <span>输入即生效 · Esc 完成编辑 · 保存在本地</span>
                        <button
                            type="button"
                            tabIndex={-1}
                            className="Custom__clear"
                            onClick={clearEditing}
                        >
                            <ClearOutlined />
                            清空
                        </button>
                    </div>
                </div>
                {text ? (
                    <TypingArea text={text} variant={variant} />
                ) : (
                    <div className="Custom__empty">在上面输入或从「我的文本」里选一段开始</div>
                )}
            </div>
        </div>
    );
};

export default Custom;
