import {FC, useState} from "react";
import {TTask} from "../../types";
import "./Task.css";
import {TaskModal} from "../TaskModal";
import {useModal} from "../../hooks/useModal";
import {ChangeableLabel} from "../ChangeableLabel";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen} from "@fortawesome/free-solid-svg-icons";

interface IProps {
    task: TTask;
    onChange_name: (task: TTask) => void;
    onChange_description: (task: TTask) => void;
}

export const Task: FC<IProps> = ({task, onChange_name, onChange_description}) => {
    const {isOpen, toggle} = useModal();

    const [name, setName] = useState<string>(task.name);
    const [description, setDescription] = useState<string>(task.description);

    const handleChangeName = () => {
        onChange_name({...task, name});
    }

    const handleChangeDescription = () => {
        onChange_description({...task, description});
    }

    return (
        <div className='task' >

            <input type='checkbox' className='task-checkbox'></input>
            <div className='task-content'>
                <label className='task-name'>{task.name}</label>
                <label className='task-description'>{task.description}</label>
            </div>
            <button className="task-edit-btn" onClick={toggle}>
                <FontAwesomeIcon icon={faPen}/>
            </button>
            <TaskModal isOpen={isOpen} toggle={toggle}>
                <ChangeableLabel component="input"
                                 className="modal-task-name"
                                 onChange={setName}
                                 handleChange={handleChangeName}
                                 value={name}
                                 placeHolder="Task name"
                />
                <ChangeableLabel component="textarea"
                                 className="modal-task-description"
                                 onChange={setDescription}
                                 handleChange={handleChangeDescription}
                                 value={description}
                                 placeHolder="Task description"
                />
            </TaskModal>
        </div>
    );
}

