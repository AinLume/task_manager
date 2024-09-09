import {FC} from "react";
import {TTaskModal} from "../../types";

interface IProps {
    modal: TTaskModal;
}

export const TaskModal: FC<IProps> = ({modal}) => {
    if (!modal.isOpen) return null;

    return (
        <div onClick={modal.onClose}
             style={{
                 position: "fixed",
                 top: 0,
                 left: 0,
                 width: "100%",
                 height: "100%",
                 background: "rgba(0, 0, 0, 0.5)",
                 display: "flex",
                 alignItems: "center",
                 justifyContent: "center",
             }}>
            <div style={{
                background: "white",
                height: 150,
                width: 240,
                margin: "auto",
                padding: "2%",
                border: "2px solid #000",
                borderRadius: "10px",
                boxShadow: "2px solid black",
            }}>
                {modal.children}
            </div>
        </div>
    );
}
