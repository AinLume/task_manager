import React, {useState} from 'react';
import {Task} from '../Task';
import {TCategory, TTask} from "../../types";
import "./styles.css";
import {TaskModal} from "../TaskModal";

export const TaskManager = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState<TCategory[]>([
        {
            id: 1,
            name: "Fruits",
            tasks: [{id: 1, name: "Apple", description: "Green, honey"},
                    {id: 3, name: "Orange", description: "Orange, honey"}]
        },
        {
            id: 2,
            name: "Cars",
            tasks: [{id: 2, name: "Volkswagen Golf", description: "GTI, 2.0 turbo"},
                    {id: 4, name: "Skoda Octavia", description: "RS, 2.0 turbo"}]
        },
    ]);
    const [currentCategory, setCurrentCategory] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [open, setOpen] = useState(false);

    const handleChangeName = (event: any) => {
        setName(event.target.value);
    }

    const handleChangeDescription = (event: any) => {
        setDescription(event.target.value);
    }

    const handleChangeCurrentCategory = (event: any) => {
        setCurrentCategory(event.target.value);
    }

    const handleChangeNewCategory = (event: any) => {
        setNewCategory(event.target.value);
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (name.trim() !== '' && description.trim() !== '' && currentCategory) {
            const new_task = {
                id: Date.now(),
                name,
                description
            };
            // setTasks();
            setName('');
            setDescription('');
        }
    };

    const handleAddCategory = () => {
        const new_category: TCategory = {
            id: 3,
            name: "Animals",
            tasks: []
        };
        setCategories([...categories, new_category]);
    };

    const handleOpenModal = () => {
        setOpen(true);
    }

    const handleCloseModal = () => {
        setOpen(false);
    }

    return (
        <div className='container'>
            {/*<form className='task-manage-form' onSubmit={handleSubmit}>*/}
            {/*    <label className='task-name-label'>*/}
            {/*        <h4>Название:</h4>*/}
            {/*        <input type='text' className='task-name' value={name} onChange={handleChangeName}></input>*/}
            {/*    </label>*/}
            {/*    <label className='task-category-label'>*/}
            {/*        <h4>Категория:</h4>*/}
            {/*        <select className="category-select" value={currentCategory} onChange={handleChangeCurrentCategory}>*/}
            {/*            <option value="">Выберите категорию</option>*/}

            {/*        </select>*/}
            {/*    </label>*/}
            {/*    <label className='task-description-label'>*/}
            {/*        <h4>Описание:</h4>*/}
            {/*        <textarea className='task-description' value={description}*/}
            {/*                  onChange={handleChangeDescription}></textarea>*/}
            {/*    </label>*/}
            {/*    <button className='task-add' type='submit'>Добавить</button>*/}
            {/*    <div className="add-category-form">*/}
            {/*        <label>*/}
            {/*            <h4>Новая категория:</h4>*/}
            {/*            <input className="category-input" type="text" value={newCategory} onChange={handleChangeNewCategory}/>*/}
            {/*        </label>*/}
            {/*        <button onClick={handleAddCategory}>Добавить категорию</button>*/}
            {/*    </div>*/}
            {/*</form>*/}
            <div className='categories-container'>
                {categories.map((category) => (
                    <div className="category" key={category.id}>
                        <p className="category-name">{category.name}</p>
                        <div className="tasks-container">
                            {category.tasks.map((task) => (
                                <Task func={handleOpenModal} key={task.id} task={task}/>
                            ))}
                        </div>
                    </div>
                ))}
                <button className="add-column-btn" onClick={handleAddCategory}>+</button>
            </div>
        </div>
    );
}