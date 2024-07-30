import React, {useState} from 'react';
import Task from './Task.js';
import './taskmanager.css';

function TaskManager () {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [columns, setColumn] = useState(0);
    const [tasks, setTasks] = useState([]);

    const handleChangeName = (event) => {
        setName(event.target.value);
    }

    const handleChangeDescription = (event) => {
        setDescription(event.target.value);
    }

    const handleChangeColumn = (event) => {
        setColumn(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (name.trim() !== '' && description.trim() !== '') {
            const new_task = {
                id: tasks.length + 1,
                name: name,
                description: description
            };
            setTasks([...tasks, new_task]);
            setName('');
            setDescription('');
        }
    };

    return (
        <div className='container'>
            <form className='task-manage-form' onSubmit={handleSubmit}>
                <label className='task-name-label'>
                    Название: 
                    <input type='text' className='task-name' value={name} onChange={handleChangeName}></input>
                </label>
                <label className='task-column-label'>
                    Номер колонны: 
                    <input type='text' className='task-column' value={columns} onChange={handleChangeColumn}></input>
                </label>
                <label className='task-description-label'>
                    Описание:
                    <textarea className='task-description' value={description} 
                    onChange={handleChangeDescription}></textarea>
                </label>
                <button className='task-add' type='submit'>Добавить</button>
            </form>
            <div className='tasks-container'>
                {tasks.map((task) => (<Task name={task.name} description={task.description} />))}
            </div>
        </div>
    );
}

export default TaskManager;