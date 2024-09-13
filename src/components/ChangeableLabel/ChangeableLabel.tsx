import React, {FC, useState} from 'react';
import {TTask} from "../../types";

interface IProps {
    component: string;
    className: string;
    onChange: (str: string) => void;
    handleChange: () => void;
    value: string;
}

export const ChangeableLabel: FC<IProps> = ({component, onChange, className, handleChange, value}) => {

    return (
        <>
            {component === "input" ? (
                <input className={className}
                       type="text"
                       value={value}
                       onChange={e => onChange(e.target.value)}
                       onBlur={handleChange}
                />
            ) : (
                <textarea className={className}
                          value={value}
                          onChange={e => onChange(e.target.value)}
                          onBlur={handleChange}
                />
            )}
        </>
    );
}