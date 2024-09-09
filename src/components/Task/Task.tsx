import {FC, useState} from "react";
import {TTask} from "../../types";
import "./Task.css";

interface IProps {
    task: TTask;
    func: () => void;
}

export const Task: FC<IProps> = ({task, func}) => (
    <div onClick={func} className='task'>
        <input type='checkbox' className='task-checkbox'></input>
        <div className='task-content'>
            <label className='task-name'>{task.name}</label>
            <label className='task-description'>{task.description}</label>
        </div>
    </div>
);