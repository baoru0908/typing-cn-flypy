/*
 * 实时统计条：速度 / 准确率 / 用时
 * 纯展示组件，数据由各打字视图计算后传入
 */
import React from 'react';

import './StatBar.less';

export interface StatItem {
    label: string;
    value: string | number;
}

interface Props {
    items: StatItem[];
    /** 是否已有输入（未开始时数值弱化显示） */
    active?: boolean;
}

const StatBar: React.FC<Props> = ({ items, active = true }) => (
    <div className={`StatBar ${active ? 'is-active' : ''}`}>
        {items.map((item) => (
            <div className="StatBar__item" key={item.label}>
                <span className="StatBar__value">{item.value}</span>
                <span className="StatBar__label">{item.label}</span>
            </div>
        ))}
    </div>
);

export default StatBar;
