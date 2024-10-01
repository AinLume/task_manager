import React, {FC, useEffect, useState} from 'react';
import {TCategory, TTask} from "../../types";
import "./styles.css";
import {Task} from "../Task";
import {useModal} from "../../hooks/useModal";
import {TaskModal} from "../TaskModal";
import {ChangeableLabel} from "../ChangeableLabel";

interface IProps {
    category: TCategory;
    onChange: (category: TCategory) => void;
}

export const CategoryColumn: FC<IProps> = ({category, onChange}) => {
    const [name, setName] = useState<string>(category.name);
    const [tasks, setTasks] = useState<TTask[]>(category.tasks);

    const [t_name, setTName] = useState<string>("");
    const [t_description, setTDescription] = useState<string>("");
    const {isOpen, toggle} = useModal();

    const [nameIsChanged, setNameIsChanged] = useState<boolean>(false);
    const [descriptionIsChanged, setDescriptionIsChanged] = useState<boolean>(false);

    const handleSetTName = () => {
        if (t_name !== "") {
            setNameIsChanged(true);
        }
    }

    const handleSetTDescription = () => {
        setDescriptionIsChanged(true);
    }

    const handleChangeName = () => {
        onChange({...category, name});
        localStorage.removeItem(name);
        localStorage.setItem(name, JSON.stringify(tasks));
    }

    const changeTask = (t: TTask) => {
        const updatedTasks =  tasks.map((task: TTask) => {
            if (task.id === t.id) {
                return t;
            }
            return task;
        });
        setTasks(updatedTasks);
        localStorage.removeItem(name);
        localStorage.setItem(name, JSON.stringify(updatedTasks));
    }

    const handleAddTask = () => {
        if (nameIsChanged && descriptionIsChanged) {
            const new_task: TTask = {
                id: tasks.length + 1,
                name: t_name,
                description: t_description
            };

            const updatedTasks = [...tasks, new_task];
            setTasks(updatedTasks);

            localStorage.removeItem(name);
            localStorage.setItem(name, JSON.stringify(updatedTasks));

            setTName("");
            setTDescription("");
            setNameIsChanged(false);
            setDescriptionIsChanged(false);
        }
    }

    useEffect(() => {
        handleAddTask();
    }, [!isOpen]);

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
                    <Task key={task.id} task={task} onChange_name={changeTask} onChange_description={changeTask}/>
                ))}
            </div>
            <div className="add-task" onClick={toggle}>
                <h1>+</h1>
            </div>
            <TaskModal isOpen={isOpen} toggle={toggle}>
                <ChangeableLabel component="input"
                                 className="modal-new-task-name"
                                 onChange={setTName}
                                 handleChange={handleSetTName}
                                 value={t_name}
                />
                <ChangeableLabel component="textarea"
                                 className="modal-task-description"
                                 onChange={setTDescription}
                                 handleChange={handleSetTDescription}
                                 value={t_description}
                />
            </TaskModal>
        </div>
    );
};