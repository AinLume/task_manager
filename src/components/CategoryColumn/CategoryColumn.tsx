import React, {FC, useState} from 'react';
import {TCategory} from "../../types";
import {Task} from "../Task";
import "./styles.css";

interface IProps {
    category: TCategory;
    onChange: (category: TCategory) => void;
}

export const CategoryColumn: FC<IProps> = ({category, onChange}) => {
    const [name, setName] = useState<string>(category.name);

    const handleChangeName = () => {
        onChange({...category, name});
    }

    return (
        <div className="category" key={category.id}>
            <input className="category-name-input"
                   type="text"
                   value={name}
                   onChange={e => setName(e.target.value)}
                   onBlur={handleChangeName}
            />
            <div className="tasks-container">
            {category.tasks.map((task) => (
                    <Task key={task.id} task={task}/>
                ))}
            </div>
        </div>
    );
};