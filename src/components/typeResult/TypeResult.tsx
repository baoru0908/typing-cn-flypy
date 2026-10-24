/*
 * 成绩卡：速度 / 准确率 / 用时
 */
import React from 'react';

import './TypeResult.less';

interface Props {
    desc: string;
    numStr: string;
    acc: number;
    secs: number;
}

const TypeResult: React.FC<Props> = (props) => {
    const cells = [
        { label: props.desc, value: props.numStr, primary: true },
        { label: '准确率', value: `${props.acc}%`, primary: false },
        { label: '用时', value: `${props.secs}s`, primary: false },
    ];

    return (
        <div className="TypeResult">
            <div className="TypeResult__head">本次成绩</div>
            <div className="TypeResult__row">
                {cells.map((cell) => (
                    <div
                        className={`TypeResult__cell ${cell.primary ? 'is-primary' : ''}`}
                        key={cell.label}
                    >
                        <span className="TypeResult__value">{cell.value}</span>
                        <span className="TypeResult__label">{cell.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TypeResult;
