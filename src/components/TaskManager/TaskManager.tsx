import React, {useEffect, useState} from 'react';
import {TCategory, TTask} from "../../types";
import "./styles.css";
import {CategoryColumn} from "../CategoryColumn";

export const TaskManager = () => {
    const [categories, setCategories] = useState<TCategory[]>([]);
    const [categoriesIds, setCategoriesIds] = useState<number[]>([]);

    useEffect(() => {
        const ls_cIds = localStorage.getItem("categoriesIds");
        let ls_categoriesIds_strings = [""];
        const ls_categoriesIds: number[] = [];
        if (ls_cIds) {
            ls_categoriesIds_strings = JSON.parse(ls_cIds);
            ls_categoriesIds_strings.forEach((id) => {ls_categoriesIds.push(Number(id))});
        }
        setCategoriesIds(ls_categoriesIds);

        const storagedCategories: TCategory[]  = [];

        for (let i = 0; i < ls_categoriesIds.length; ++i) {
            const data = localStorage.getItem(String(ls_categoriesIds[i]));
            if (data) {
                const parsedData = JSON.parse(data);
                const ls_name = parsedData.name;
                const ls_tasks = parsedData.tasks;

                const tasks: TTask[] = ls_tasks.map((task: any) => ({
                    id: task.id,
                    name: task.name,
                    description: task.description
                }));

                const category: TCategory = {
                    id: ls_categoriesIds[i],
                    name: ls_name,
                    tasks: tasks
                };

                storagedCategories.push(category);
            }
        }

        setCategories(storagedCategories);

    }, []);

    const handleAddCategory = () => {
        const newId = categoriesIds.length !== 0 ? categoriesIds[categoriesIds.length - 1] + 1 : 1;
        const new_category: TCategory = {
            id: newId,
            name: "",
            tasks: []
        };
        const newCategoriesId = [...categoriesIds, newId];

        setCategoriesIds(newCategoriesId)
        setCategories(prevState => [...prevState, new_category]);

        localStorage.setItem(String(newId), JSON.stringify(new_category));
        localStorage.setItem("categoriesIds", JSON.stringify(newCategoriesId));
    };

    const changeCategoryName = (c: TCategory) => {
        setCategories(prevState => prevState.map((category: TCategory) =>
            category.id === c.id ? c : category
        ));
    }

    const handleDeleteCategory = (id: number) => {
        setCategories(prevState => prevState.filter((c) => c.id !== id));

        const newCIds = categoriesIds.filter((id_y: number) => id_y !== id);

        setCategoriesIds(newCIds);
        localStorage.setItem("categoriesIds", JSON.stringify(newCIds));
    }

    return (
        <div className='container'>
            <div className='categories-container'>
                {categories.map((category) => (
                    <CategoryColumn key={category.id} category={category} onChange={changeCategoryName} deleteCategory={handleDeleteCategory}/>
                ))}
                <button className="add-column-btn" onClick={handleAddCategory}>+ Add category</button>
            </div>
        </div>
    );
}