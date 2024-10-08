import {ReactNode} from "react";
import "./styles.css";

export interface TTaskModal {
    isOpen: boolean;
    toggle: () => void;
    children?: ReactNode;
}

export const TaskModal = (props: TTaskModal) => (
    <>
        {props.isOpen && (
            <div className="modal-overlay">
                <div className="modal-box">
                    {props.children}
                    <button className="modal-btn" onClick={props.toggle}>Save</button>
                </div>
            </div>
        )}
    </>
)
