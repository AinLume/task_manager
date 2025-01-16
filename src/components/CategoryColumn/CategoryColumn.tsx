import React, {FC, useEffect, useState} from 'react';
import {TCategory, TTask} from "../../types";
import "./styles.css";
import {Task} from "../Task";
import {useModal} from "../../hooks/useModal";
import {TaskModal} from "../TaskModal";
import {ChangeableLabel} from "../ChangeableLabel";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";

interface IProps {
    category: TCategory;
    onChange: (category: TCategory) => void;
    deleteCategory: (id: number) => void;
}

export const CategoryColumn: FC<IProps> = ({category, onChange, deleteCategory}) => {
    const [name, setName] = useState<string>(category.name);
    const [tasks, setTasks] = useState<TTask[]>(category.tasks);

    const [t_name, setTName] = useState<string>("");
    const [t_description, setTDescription] = useState<string>("");
    const {isOpen, toggle} = useModal();

    const [nameIsChanged, setNameIsChanged] = useState<boolean>(false);
    const [descriptionIsChanged, setDescriptionIsChanged] = useState<boolean>(false);

    // drag&drop
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        const task_div =  event.currentTarget;
        const task_id = task_div.getAttribute("data-id");
        const task_name = task_div.getAttribute("data-name");
        const task_description = task_div.getAttribute("data-description");

        if (task_id && task_name && task_description) {
            const saved_task: TTask = {
                id: parseInt(task_id),
                name: task_name,
                description: task_description
            };
            event.dataTransfer.setData("task", JSON.stringify(saved_task));

            handleDeleteTask(saved_task);
        }
        else {
            console.log("Task doesn't exist");
        }
    }

    const enableDropping = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    }

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const data = event.dataTransfer.getData("task");

        if (data) {
            try {
                const parsedData = JSON.parse(data);

                if (parsedData.id && parsedData.name && parsedData.description) {

                    const task: TTask = ({
                        id: tasks[tasks.length - 1].id + 1,
                        name: parsedData.name,
                        description: parsedData.description
                    });
                    const updatedTasks = [...tasks, task];
                    setTasks(updatedTasks);

                    const new_category: TCategory = {
                        id: category.id,
                        name: category.name,
                        tasks: updatedTasks
                    }
                    localStorage.removeItem(String(new_category.id));
                    localStorage.setItem(String(new_category.id), JSON.stringify(new_category));

                    console.log("D&D, id - " + data);
                }
                else {
                    console.log("Invalid task data")
                }
            }
            catch(error) {
                console.error("Failed to save task", error);
            }
        }
        else {
            console.error("No task data");
        }
    };
    // drag&drop

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
                id: tasks.length + 1,
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

    const handleDeleteTask = (t: TTask) => {
        const index = tasks.findIndex((task: TTask) => task.id === t.id);
        const updatedTasks = tasks.splice(index, 1);

        setTasks(updatedTasks);

        const new_category: TCategory = {
            id: category.id,
            name: category.name,
            tasks: updatedTasks
        };

        localStorage.removeItem(String(new_category.id));
        localStorage.setItem(String(new_category.id), JSON.stringify(new_category));
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
            <div onDragOver={enableDropping} onDrop={handleDrop} className="tasks-container">
                {tasks.map((task) => (
                    <div draggable="true" onDragStart={handleDragStart} id={category.id.toString() + task.id.toString()} key={task.id}
                         data-id={task.id} data-name={task.name} data-description={task.description}>

                        <Task key={task.id} task={task} onChange_name={changeTask} onChange_description={changeTask}/>

                    </div>
                ))}
            </div>
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