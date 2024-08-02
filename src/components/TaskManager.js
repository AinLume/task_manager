import React, {useState} from 'react';
import Task from './Task.js';
import './taskmanager.css';

function TaskManager () {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [tasks, setTasks] = useState([]);
    const [currentCategory, setCurrentCategory] = useState('');
    const [newCategory, setNewCategory] = useState('');

    const handleChangeName = (event) => {
        setName(event.target.value);
    }

    const handleChangeDescription = (event) => {
        setDescription(event.target.value);
    }

    const handleChangeCurrentCategory = (event) => {
        setCurrentCategory(event.target.value);
    }

    const handleChangeNewCategory = (event) => {
        setNewCategory(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (name.trim() !== '' && description.trim() !== '' && currentCategory) {
            const new_task = {
                id: Date.now(),
                name,
                description
            };
            setTasks((prevTasks) => prevTasks.map((category) =>
            category.category === currentCategory ? {...category, items: [...category.items, new_task]} : category ));
            setName('');
            setDescription('');
        }
    };

    const handleAddCategory = () => {
        if (newCategory.trim() !== "") {
            setTasks((prevTasks) => [...prevTasks, { category: newCategory, items: [] }]);
            setCurrentCategory(newCategory);
            setNewCategory('');
        }
    };

    return (
        <div className='container'>
            <form className='task-manage-form' onSubmit={handleSubmit}>
                <label className='task-name-label'>
                    Название:
                    <input type='text' className='task-name' value={name} onChange={handleChangeName}></input>
                </label>
                <label className='task-category-label'>
                    Категория:
                    <select value={currentCategory} onChange={handleChangeCurrentCategory}>
                        <option value="">Выберите категорию</option>
                        {tasks.map((category, index) => (
                            <option key={index} value={category.category}>{category.category}</option>
                        ))}
                    </select>
                </label>
                <label className='task-description-label'>
                    Описание:
                    <textarea className='task-description' value={description}
                              onChange={handleChangeDescription}></textarea>
                </label>
                <button className='task-add' type='submit'>Добавить</button>
                <div className="add-category-form">
                    <label>
                        Новая категория:
                        <input type="text" value={newCategory} onChange={handleChangeNewCategory}/>
                    </label>
                    <button onClick={handleAddCategory}>Добавить категорию</button>
                </div>
            </form>
            <div className='tasks-container'>
                {tasks.map((category, index) => (
                    <div className='category-columns' key={index}>
                        <h2>{category.category}</h2>
                        <ul>
                            {category.items.map((task) => (
                                <Task key={task.id} name={task.name} description={task.description} />
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TaskManager;