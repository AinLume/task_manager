import React, {FC, useState} from 'react';
import {TCategory, TTask} from "../../types";
import {Task} from "../Task";
import "./styles.css";

interface IProps {
    category: TCategory;
    onChange: (category: TCategory) => void;
}

export const CategoryColumn: FC<IProps> = ({category, onChange}) => {
    const [name, setName] = useState<string>(category.name);
    const [tasks, setTasks] = useState<TTask[]>(category.tasks);

    const handleChangeName = () => {
        onChange({...category, name});
        localStorage.removeItem(category.name);
        localStorage.setItem(name, JSON.stringify(category.tasks));
    }

    const changeTaskName = (t: TTask) => {
        setTasks(prevState => prevState.map((task: TTask) => {
            if (task.id === t.id) {
                return t;
            }
            return task;
        }));
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
            {tasks.map((task) => (
                    <Task key={task.id} task={task} onChange={changeTaskName} />
                ))}
            </div>
        </div>
    );
};