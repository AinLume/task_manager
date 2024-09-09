import React from "react";

export type TTask = {
    id: number;
    name: string;
    description: string;
};

export type TCategory = {
    id: number;
    name: string;
    tasks: TTask[];
}

export type TTaskModal = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}