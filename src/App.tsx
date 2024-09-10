import React from 'react';
import './App.css';
import {TaskManager} from "./components/TaskManager/TaskManager";

export const App = () => {
    return (
        <div className="App">
            <TaskManager/>
        </div>
    );
}