import React from 'react';
import './task.css';

const Task = (props) => (
    <div className='task'>
        <input type='checkbox' className='task-checkbox'></input>
        <div className='task-content'>
            <label className='task-name'>{props.name}</label>
            <label className='task-description'>{props.description}</label>
        </div>
    </div>
);

export default Task;