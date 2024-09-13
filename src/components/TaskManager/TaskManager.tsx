import React, {useState} from 'react';
import {TCategory, TTask} from "../../types";
import "./styles.css";
import {CategoryColumn} from "../CategoryColumn";

export const TaskManager = () => {
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

    const handleAddCategory = () => {
        const new_category: TCategory = {
            id: 3,
            name: "",
            tasks: []
        };
        setCategories(prevState => [...prevState, new_category]);
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