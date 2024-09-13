import {FC, useState} from "react";
import {TTask} from "../../types";
import "./Task.css";
import {TaskModal} from "../TaskModal";
import {useModal} from "../../hooks/useModal";
import {ChangeableLabel} from "../ChangeableLabel/ChangeableLabel";

interface IProps {
    task: TTask;
    onChange: (task: TTask) => void;
}

export const Task: FC<IProps> = ({task, onChange}) => {
    const {isOpen, toggle} = useModal();

    const [name, setName] = useState<string>(task.name);
    const [description, setDescription] = useState<string>(task.description);

    const handleChangeName = () => {
        onChange({...task, name});
    }

    const handleChangeDescription = () => {
        onChange({...task, description});
    }

    return (
        <div className='task'>
            <input type='checkbox' className='task-checkbox'></input>
            <div className='task-content' onClick={toggle}>
                <label className='task-name'>{task.name}</label>
                <label className='task-description'>{task.description}</label>
            </div>
            <TaskModal isOpen={isOpen} toggle={toggle}>
                <div className='modal-task-content'>
                    <ChangeableLabel component="input"
                                     className="modal-task-name"
                                     onChange={setName}
                                     handleChange={handleChangeName}
                                     value={name}
                    />
                    <ChangeableLabel component="textarea"
                                     className="modal-task-description"
                                     onChange={setDescription}
                                     handleChange={handleChangeDescription}
                                     value={description}
                    />
                </div>
            </TaskModal>
        </div>
    );
}

