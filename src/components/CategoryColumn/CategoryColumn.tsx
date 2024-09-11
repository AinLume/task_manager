import React, {FC, useState} from 'react';
import {TCategory} from "../../types";
import {Task} from "../Task";
import "./styles.css";

interface IProps {
    category: TCategory;
}

export const CategoryColumn: FC<IProps> = ({category}) => {
    const [editing, setEditing] = useState<boolean>(false);
    const [name, setName] = useState<string>(category.name);

    const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }

    const handleEditOn = () => {
        setEditing(true);
    }

    const handleEditOff = () => {
        setEditing(false);
    }

    return (
        <div className="category" key={category.id}>
            {editing ? (
                <div className="edit-column-container">
                    <input className="category-name-input" type="text" value={name} onChange={handleChangeName}/>
                    <button className="category-name-btn" onClick={handleEditOff}>save</button>
                </div>
            ) : (
                <div className="edit-column-container">
                    <p className="category-name">{category.name}</p>
                    <button className="category-name-btn" onClick={handleEditOn}>edit</button>
                </div>
            )}
            <div className="tasks-container">
            {category.tasks.map((task) => (
                    <Task key={task.id} task={task}/>
                ))}
            </div>
        </div>
    );
};