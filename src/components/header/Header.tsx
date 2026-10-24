/*
 * 顶栏：品牌 / 模式切换 / 输入方案 / 主题 / 设置
 * - 模式入口改为分段控件，选中项浮起，不再使用与语义无关的铃铛图标
 * - 输入方案（全拼 / 小鹤双拼）保留在中英切换的同一区域，仅中文模式可见
 * - 词组设置、字号收进设置面板；主题面板改为分组预览卡
 */
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Row, Col, Button, Modal, Tabs, Input, Tooltip } from 'antd';
import { AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

import './Header.less';
import { storeConnect, MapState, MapDispatch } from '@/store/index';
import WORDS from '@/words';

import themeList, { changeTheme } from '@/themes';
import { isLightColor } from '@/utils/color';
import { isSingleFile } from '@/utils/env';

// 顶栏模式入口
const MODE_ROUTES: { route: string; label: string }[] = [
    { route: 'monkey', label: '中文双拼' },
    { route: 'english', label: '英文' },
    { route: 'code', label: '代码' },
    { route: 'custom', label: '自定义' },
];

const reg = /^[\u2E80-\u9FFF]+$/;
const defaultWordStr = WORDS.map((item) => item.label).join('|');

const SCALE_OPTIONS = [
    { value: 's', label: '标准' },
    { value: 'm', label: '大' },
    { value: 'l', label: '特大' },
];

/* 汉字字族：两套都自带预览，直接看字形选，比看名字可靠。
   单文件版只内置思源黑体，霞鹜文楷卡片在打包版里隐藏。 */
const HANZI_OPTIONS = [
    {
        value: 'sans',
        label: '思源黑体',
        note: '黑体，与英文字形同源，中英混排不跳',
    },
    {
        value: 'kai',
        label: '霞鹜文楷',
        note: '楷体，笔画舒展，适合长时间阅读',
    },
].filter((opt) => !(isSingleFile() && opt.value === 'kai'));

const BrandMark = () => (
    <svg className="brand__svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect
            x="2.2"
            y="7"
            width="19.6"
            height="12.4"
            rx="3.6"
            stroke="currentColor"
            strokeWidth="1.6"
        />
        <path
            d="M7.4 15.6 12 10.2l4.6 5.4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const Header: React.FC<MapState & MapDispatch> = (props) => {
    const [settingModalVisible, setSettingModalVisible] = useState(false);
    const [themeModalVisible, setThemeModalVisible] = useState(false);
    const [wordsMode, setWordsMode] = useState(props.$state.root.wordsMode);
    const defaultWordsRef = useRef(defaultWordStr);
    const [words, setWords] = useState(
        props.$state.root.customerWords && props.$state.root.customerWords.length !== 0
            ? props.$state.root.customerWords.map((item) => item.label).join('|')
            : defaultWordStr
    );
    const [errorWordList, setErrorWordList] = useState<string[]>([]);

    const { search, pathname } = useLocation();
    const navigate = useNavigate();

    const activeRoute = pathname === '/' ? '/monkey' : pathname;
    // 未手动选过主题时，实际生效的是 default
    const currentTheme = props.$state.root.uiTheme || 'default';

    // 主题按明暗分组，便于挑选
    const themeGroups = useMemo(() => {
        const dark: typeof themeList = [];
        const light: typeof themeList = [];
        themeList.forEach((theme) => {
            (isLightColor(theme.bgColor) ? light : dark).push(theme);
        });
        return [
            { title: '深色', items: dark },
            { title: '浅色', items: light },
        ];
    }, []);

    const onUiSizeChange = (value: string) => {
        props.$dispatch('setUiScale', value);
    };
    const handleModalOk = async () => {
        if (wordsMode === '1') {
            props.$dispatch('setWordsMode', wordsMode);
            setSettingModalVisible(false);
            return;
        }
        const inputWordList = Array.from(new Set(words.split('|').filter(Boolean)));
        const errorList: string[] = [];
        if (inputWordList.length === 0) errorList.push('请输入字词，并以符号|间隔');
        inputWordList.forEach((word) => {
            if (!reg.test(word)) errorList.push(word);
        });
        setErrorWordList(errorList);
        if (errorList.length === 0) {
            const { getPinyin } = await import('@/utils/pinyin');
            props.$dispatch('setWordsMode', wordsMode);
            setWords(inputWordList.join('|'));
            const actWordList = inputWordList.map((word) => ({
                label: word,
                text: getPinyin(word),
            }));
            props.$dispatch('saveCustomerWords', actWordList);
            setSettingModalVisible(false);
        }
    };
    const onTabsChange = (activeKey: string) => {
        setWordsMode(activeKey);
        setErrorWordList([]);
    };
    const onTextInput = (evt: any) => {
        setWords(evt.target.value);
    };
    const themeBlockClick = (theme: any) => {
        const href = window.location.href;
        if (href.includes('#') && href.includes('?')) {
            window.location.href = href.split('?')[0];
        }
        props.$dispatch('setUiTheme', theme.name);
    };

    const go = (route: string) => {
        navigate(route);
    };

    useEffect(() => {
        if (search) {
            const themeObj = themeList.find((th) => th.name === search.slice(1).replace('-', ' '));
            if (themeObj) {
                changeTheme(themeObj);
            }
        } else if (props.$state.root.uiTheme) {
            const themeObj = themeList.find((th) => th.name === props.$state.root.uiTheme);
            if (themeObj) {
                changeTheme(themeObj);
            }
        }
    }, [search, props.$state.root.uiTheme]);

    return (
        <div className="app-header">
            <div className="app-header__inner">
                <div className="brand" onClick={() => go('/monkey')} role="link" tabIndex={-1}>
                    <span className="brand__mark">
                        <BrandMark />
                    </span>
                    <span className="brand__text">
                        <b>鹤键</b>
                        <em>CraneType</em>
                    </span>
                </div>

                <nav className="modes" aria-label="练习模式">
                    {MODE_ROUTES.map((mode) => (
                        <button
                            key={mode.route}
                            type="button"
                            tabIndex={-1}
                            className={`modes__item ${
                                activeRoute === `/${mode.route}` ? 'is-active' : ''
                            }`}
                            onClick={() => go(mode.route)}
                        >
                            {mode.label}
                        </button>
                    ))}
                </nav>

                <div className="tools">
                    <Tooltip title="主题" placement="bottom">
                        <button
                            type="button"
                            tabIndex={-1}
                            className="tool-btn"
                            onClick={() => setThemeModalVisible(true)}
                            aria-label="切换主题"
                        >
                            <AppstoreOutlined />
                        </button>
                    </Tooltip>
                    <Tooltip title="设置" placement="bottom">
                        <button
                            type="button"
                            tabIndex={-1}
                            className="tool-btn"
                            onClick={() => setSettingModalVisible(true)}
                            aria-label="打开设置"
                        >
                            <SettingOutlined />
                        </button>
                    </Tooltip>
                </div>
            </div>

            {/* ---------------- 设置 ---------------- */}
            <Modal
                className="ui-modal settings-modal"
                title={null}
                visible={settingModalVisible}
                footer={null}
                width={640}
                onCancel={() => setSettingModalVisible(false)}
            >
                <div className="settings">
                    <div className="settings__head">
                        <h3>设置</h3>
                        <p>调整字号与练习用的词组，改动会保存在本机</p>
                    </div>

                    <div className="settings__row">
                        <div className="settings__label">
                            <b>字号</b>
                            <span>影响打字区文字大小</span>
                        </div>
                        <div className="seg" role="group" aria-label="字号">
                            {SCALE_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    tabIndex={-1}
                                    className={
                                        props.$state.root.uiScale === opt.value ? 'is-active' : ''
                                    }
                                    onClick={() => onUiSizeChange(opt.value)}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="settings__row settings__row--top">
                        <div className="settings__label">
                            <b>汉字</b>
                            <span>只影响中文，拼音与英文保持不变</span>
                        </div>
                        <div className="font-picker" role="group" aria-label="汉字字体">
                            {HANZI_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    tabIndex={-1}
                                    className={[
                                        'font-card',
                                        `font-card--${opt.value}`,
                                        props.$state.root.hanziFont === opt.value ? 'is-active' : '',
                                    ]
                                        .filter(Boolean)
                                        .join(' ')}
                                    onClick={() => props.$dispatch('setHanziFont', opt.value)}
                                    aria-pressed={props.$state.root.hanziFont === opt.value}
                                >
                                    <span className="font-card__sample">永和九年</span>
                                    <span className="font-card__meta">
                                        <b>{opt.label}</b>
                                        <span>{opt.note}</span>
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="settings__row settings__row--block">
                        <div className="settings__label">
                            <b>词组</b>
                            <span>用竖线 | 分隔，仅支持汉字</span>
                        </div>
                        <Tabs defaultActiveKey={wordsMode} onChange={onTabsChange}>
                            <Tabs.TabPane tab="默认词组" key="1">
                                <Input.TextArea
                                    autoSize={{ minRows: 8, maxRows: 14 }}
                                    disabled
                                    defaultValue={defaultWordsRef.current}
                                />
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="自定义词组" key="2">
                                <Input.TextArea
                                    autoSize={{ minRows: 8, maxRows: 14 }}
                                    value={words}
                                    onChange={onTextInput}
                                    placeholder="例如：春天|秋天|程序员"
                                />
                            </Tabs.TabPane>
                        </Tabs>
                        <Row className="header-modal--words-length">
                            <Col span={12}>
                                <Row gutter={6} className="error-word">
                                    {errorWordList.map((err, index) => (
                                        <Col key={index}>{err}</Col>
                                    ))}
                                </Row>
                            </Col>
                            <Col span={12} className="header-modal--total">
                                共{' '}
                                {wordsMode === '1'
                                    ? defaultWordsRef.current.split('|').length
                                    : words.split('|').filter(Boolean).length}{' '}
                                个词
                            </Col>
                        </Row>
                    </div>

                    <div className="settings__actions">
                        <Button
                            tabIndex={-1}
                            className="settings__save"
                            type="primary"
                            onClick={handleModalOk}
                        >
                            保存并应用
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* ---------------- 主题 ---------------- */}
            <Modal
                className="ui-modal theme-modal"
                title={null}
                visible={themeModalVisible}
                footer={null}
                width={760}
                onCancel={() => setThemeModalVisible(false)}
            >
                <div className="theme-picker">
                    <div className="settings__head">
                        <h3>主题</h3>
                        <p>共 {themeList.length} 套配色，深浅成对</p>
                    </div>
                    {themeGroups.map((group) => (
                        <div className="theme-group" key={group.title}>
                            <div className="theme-group__title">
                                {group.title}
                                <span>{group.items.length}</span>
                            </div>
                            <div className="theme-grid">
                                {group.items.map((theme) => (
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        className={`theme-card ${
                                            currentTheme === theme.name ? 'is-active' : ''
                                        }`}
                                        key={theme.name}
                                        onClick={() => themeBlockClick(theme)}
                                        style={{ background: theme.bgColor }}
                                    >
                                        <span className="theme-card__preview">
                                            <i
                                                className="theme-card__line is-strong"
                                                style={{ background: theme.textColor }}
                                            />
                                            <i
                                                className="theme-card__line"
                                                style={{ background: theme.textColor }}
                                            />
                                            <i
                                                className="theme-card__line is-short"
                                                style={{ background: theme.textColor }}
                                            />
                                        </span>
                                        <span
                                            className="theme-card__name"
                                            style={{ color: theme.textColor }}
                                        >
                                            {theme.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
};

export default storeConnect(Header);
