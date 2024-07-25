import React, {useState} from 'react';
import Task from './Task.js'

function TaskManager () {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleChangeName = (event) => {
        setName(event.target.value);
    }

    const handleChangeDescription = (event) => {
        setDescription(event.target.value);
    }

    const handleSubmit = (name, description) => <Task name={name} description={description}/>;

    return (
        <form className='task-manage-form' onSubmit={handleSubmit}>
            <label className='task-name-label'>
                Название: 
                <input type='text' className='task-name' value={name} onChange={handleChangeName}></input>
            </label>
            <label className='task-description-label'>
                Описание:
                <input type='text' className='task-description' value={description} 
                onChange={handleChangeDescription}></input>
            </label>
            <button className='task-add'>Добавить</button>
        </form>
    );
}

export default TaskManager;