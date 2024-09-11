import React, {useState} from 'react';
import {Task} from '../Task';
import {TCategory, TTask} from "../../types";
import "./styles.css";
import {TaskModal} from "../TaskModal";
import {CategoryColumn} from "../CategoryColumn";

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
            name: "",
            tasks: []
        };
        setCategories([...categories, new_category]);
    };

    const changeCategoryName = (category: TCategory) => {
        category.name = name;
        console.log("Name was editing" + category.name);
    }

    const handleOpenModal = () => {
        setOpen(true);
    }

    const handleCloseModal = () => {
        setOpen(false);
    }

    return (
        <div className='container'>
            <div className='categories-container'>
                {categories.map((category) => (
                    <CategoryColumn category={category} onChange={changeCategoryName}/>
                ))}
                <button className="add-column-btn" onClick={handleAddCategory}>+</button>
            </div>
        </div>
    );
}