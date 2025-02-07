import React, {FC, useEffect, useState} from 'react';
import {TCategory, TTask} from "../../types";
import "./styles.css";
import {Task} from "../Task";
import {useModal} from "../../hooks/useModal";
import {TaskModal} from "../TaskModal";
import {ChangeableLabel} from "../ChangeableLabel";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";

import {Draggable, Droppable} from 'react-beautiful-dnd';

interface IProps {
    category: TCategory;
    onChange: (category: TCategory) => void;
    deleteCategory: (id: number) => void;
    deleteTaskFromCategoryById: (categoryId: number, taskId: number) => void;
    generateTaskId: () => number;
}

export const CategoryColumn: FC<IProps> = ({category, onChange, deleteCategory, deleteTaskFromCategoryById, generateTaskId}) => {
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

        const new_category: TCategory = {
            id: category.id,
            name: name,
            tasks: category.tasks
        };

        localStorage.removeItem(String(new_category.id));
        localStorage.setItem(String(new_category.id), JSON.stringify(new_category));
    }

    const changeTask = (t: TTask) => {
        const updatedTasks =  tasks.map((task: TTask) => {
            if (task.id === t.id) {
                return t;
            }
            return task;
        });
        setTasks(updatedTasks);

        const new_category: TCategory = {
            id: category.id,
            name: category.name,
            tasks: updatedTasks
        };

        localStorage.removeItem(String(new_category.id));
        localStorage.setItem(String(new_category.id), JSON.stringify(new_category));
    }

    const handleAddTask = () => {
        if (nameIsChanged && descriptionIsChanged) {
            const new_task: TTask = {
                id: generateTaskId(),
                name: t_name,
                description: t_description
            };

            const updatedTasks = [...tasks, new_task];
            setTasks(updatedTasks);

            const new_category: TCategory = {
                id: category.id,
                name: category.name,
                tasks: updatedTasks
            }

            localStorage.removeItem(String(new_category.id));
            localStorage.setItem(String(new_category.id), JSON.stringify(new_category));

            setTName("");
            setTDescription("");
            setNameIsChanged(false);
            setDescriptionIsChanged(false);
        }
    }

    const handleDeleteCategory = () => {
        localStorage.removeItem(String(category.id));
        deleteCategory(category.id);
    }

    useEffect(() => {
        if (!isOpen) {
            handleAddTask();
        }
    }, [isOpen]);

    return (
        <div className="category" key={category.id}>
            <div className="input-container">
                <input className="category-name-input"
                       type="text"
                       value={name}
                       onChange={e => setName(e.target.value)}
                       onBlur={handleChangeName}
                />
                <button className="category-delete" onClick={handleDeleteCategory}>
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
            <Droppable droppableId={category.id.toString()}>
                {(provided) => (
                    <div className="tasks-container" ref={provided.innerRef} {...provided.droppableProps}>
                        {tasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id.toString()} index={index}>

                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                        <Task key={task.id} task={task} onChange_name={changeTask}
                                              onChange_description={changeTask} />
                                    </div>
                                )}

                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            <div className="add-task" onClick={toggle}>
                <label>+ Add task</label>
            </div>
            <TaskModal isOpen={isOpen} toggle={toggle}>
                <ChangeableLabel component="input"
                                 className="modal-task-name"
                                 onChange={setTName}
                                 handleChange={handleSetTName}
                                 value={t_name}
                                 placeHolder="Task name"
                />
                <ChangeableLabel component="textarea"
                                 className="modal-task-description"
                                 onChange={setTDescription}
                                 handleChange={handleSetTDescription}
                                 value={t_description}
                                 placeHolder="Task description"
                />
            </TaskModal>
        </div>
);
};