import React, {FC, useState} from 'react';

interface IProps {
    component: string;
    className: string;
    onChange: (str: string) => void;
    handleChange: () => void;
    value: string;
    placeHolder?: string;
}

export const ChangeableLabel: FC<IProps> = ({component, onChange, placeHolder, className, handleChange, value}) => {

    return (
        <>
            {component === "input" ? (
                <input className={className}
                       type="text"
                       value={value}
                       onChange={e => onChange(e.target.value)}
                       onBlur={handleChange}
                       placeholder={placeHolder}
                />
            ) : (
                <textarea className={className}
                          value={value}
                          onChange={e => onChange(e.target.value)}
                          onBlur={handleChange}
                          placeholder={placeHolder}
                />
            )}
        </>
    );
}