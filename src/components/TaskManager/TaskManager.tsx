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
                                id: tasks[0].id,
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
            id: 3,
            name: "",
            tasks: []
        };
        setCategories(prevState => [...prevState, new_category]);
        categories.forEach((category: TCategory) => {
            localStorage.setItem(category.name, JSON.stringify(category.tasks));
            console.log(category.name);
            console.log(JSON.stringify(category.tasks));
        })
    };

    const changeCategoryName = (c: TCategory) => {
        setCategories(prevState => prevState.map((category: TCategory) => {
            if (category.id === c.id) {
                return c;
            }
            return category;
        }));
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