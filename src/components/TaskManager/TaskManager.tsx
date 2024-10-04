import React, {useEffect, useState} from 'react';
import {TCategory, TTask} from "../../types";
import "./styles.css";
import {CategoryColumn} from "../CategoryColumn";

export const TaskManager = () => {
    const [categories, setCategories] = useState<TCategory[]>([]);

    useEffect(() => {
        const storageCategories: TCategory[] = [];

        for (let i = 0; i < localStorage.length; ++i) {
            const key = localStorage.key(i);
            if (key) {
                const data = localStorage.getItem(key);
                if (data) {
                    try {
                        const parseData = JSON.parse(data);

                        if (Array.isArray(parseData)) {
                            const tasks: TTask[] = parseData.map((task: any) => ({
                                id: task.id,
                                name: task.name,
                                description: task.description
                            }));

                            const category: TCategory = {
                                id: tasks.length > 0 ? tasks[0].id : 0,
                                name: key,
                                tasks: tasks
                            };
                            storageCategories.push(category);
                        }

                    } catch(error) {
                        console.error("Не удалось спрасить JSON");
                    }
                }
            }
        }

        setCategories(storageCategories);

    }, []);

    const handleAddCategory = () => {
        const new_category: TCategory = {
            id: categories.length + 1,
            name: "",
            tasks: []
        };

        setCategories(prevState => [...prevState, new_category]);
    };

    const changeCategoryName = (c: TCategory) => {
        const oldCategory = categories.find(category => category.id === c.id);

        setCategories(prevState => prevState.map((category: TCategory) =>
            category.id === c.id ? c : category
        ));

        if (oldCategory && oldCategory.name.trim() !== "") {
            localStorage.removeItem(oldCategory.name);
        }

        if (c.name.trim() !== "") {
            localStorage.setItem(c.name, JSON.stringify(c.tasks));
        }
    }

    const handleDeleteCategory = (id: number) => {
        setCategories(prevState => prevState.filter((c) => c.id !== id));
    }

    return (
        <div className='container'>
            <div className='categories-container'>
                {categories.map((category) => (
                    <CategoryColumn key={category.id} category={category} onChange={changeCategoryName} deleteCategory={handleDeleteCategory}/>
                ))}
                <button className="add-column-btn" onClick={handleAddCategory}>+</button>
            </div>
        </div>
    );
}