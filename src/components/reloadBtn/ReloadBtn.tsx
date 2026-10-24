/*
 * 重新开始：带文字标签的次级按钮（旧版是 90×90 纯图标，视觉上与加载动画同构）
 */
import React from 'react';
import { ReloadOutlined } from '@ant-design/icons';

import './ReloadBtn.less';

interface Props {
    onClick: () => void;
    label?: string;
    /** 右侧快捷键提示，如 "Tab" */
    hint?: string;
}

const ReloadBtn: React.FC<Props> = ({ onClick, label = '重新开始', hint }) => (
    <button className="ReloadBtn" onClick={onClick} type="button" tabIndex={-1}>
        <ReloadOutlined className="ReloadBtn__icon" />
        <span className="ReloadBtn__label">{label}</span>
        {hint && <kbd className="ReloadBtn__kbd">{hint}</kbd>}
    </button>
);

export default ReloadBtn;
