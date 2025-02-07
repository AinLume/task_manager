import React, {useEffect, useState} from 'react';
import {TCategory, TTask} from "../../types";
import "./styles.css";
import {CategoryColumn} from "../CategoryColumn";
import {DragDropContext, DropResult} from 'react-beautiful-dnd';

export const TaskManager = () => {
    const [categories, setCategories] = useState<TCategory[]>([]);
    const [categoriesIds, setCategoriesIds] = useState<number[]>([]);
    const [tasksIds, setTasksIds] = useState<number[]>([]);

    useEffect(() => {
        const ls_cIds = localStorage.getItem("categoriesIds");
        let ls_categoriesIds_strings = [""];
        const ls_categoriesIds: number[] = [];
        if (ls_cIds) {
            ls_categoriesIds_strings = JSON.parse(ls_cIds);
            ls_categoriesIds_strings.forEach((id) => {ls_categoriesIds.push(Number(id))});
        }
        setCategoriesIds(ls_categoriesIds);

        const ls_tIds = localStorage.getItem("tasksIds");
        let ls_tasksIds_str = [""];
        const ls_tasksIds: number[] = [];
        if (ls_tIds) {
            ls_tasksIds_str = JSON.parse(ls_tIds);
            ls_tasksIds_str.forEach((id) => {ls_tasksIds.push(Number(id))});
        }
        setTasksIds(ls_tasksIds);


        const storagedCategories: TCategory[]  = [];

        for (let i = 0; i < ls_categoriesIds.length; ++i) {
            const data = localStorage.getItem(String(ls_categoriesIds[i]));
            if (data) {
                const parsedData = JSON.parse(data);
                const ls_name = parsedData.name;
                const ls_tasks = parsedData.tasks;

                const tasks: TTask[] = ls_tasks.map((task: any) => ({
                    id: task.id,
                    name: task.name,
                    description: task.description
                }));

                const category: TCategory = {
                    id: ls_categoriesIds[i],
                    name: ls_name,
                    tasks: tasks
                };

                storagedCategories.push(category);
            }
        }

        setCategories(storagedCategories);

    }, []);

    const handleAddCategory = () => {
        const newId = categoriesIds.length !== 0 ? categoriesIds[categoriesIds.length - 1] + 1 : 1;
        const new_category: TCategory = {
            id: newId,
            name: "",
            tasks: []
        };
        const newCategoriesId = [...categoriesIds, newId];

        setCategoriesIds(newCategoriesId)
        setCategories(prevState => [...prevState, new_category]);

        localStorage.setItem(String(newId), JSON.stringify(new_category));
        localStorage.setItem("categoriesIds", JSON.stringify(newCategoriesId));
    };

    const changeCategoryName = (c: TCategory) => {
        setCategories(prevState => prevState.map((category: TCategory) =>
            category.id === c.id ? c : category
        ));
    }

    const handleDeleteCategory = (id: number) => {
        const cToDel = categories.filter(c => c.id === id);
        const cTasksIds = cToDel[0].tasks.map(t => t.id);

        setCategories(prevState => prevState.filter((c) => c.id !== id));

        const newTasksIds = tasksIds.filter(item => !cTasksIds.includes(item));
        const newCIds = categoriesIds.filter((id_y: number) => id_y !== id);

        setTasksIds(newTasksIds);
        setCategoriesIds(newCIds);
        localStorage.setItem("tasksIds", JSON.stringify(newTasksIds));
        localStorage.setItem("categoriesIds", JSON.stringify(newCIds));
    }

    const deleteTaskFromCategoryById = (categoryId: number, taskId: number) => {
        const updatedCategories = categories.map((category: TCategory) => {
           if (category.id === categoryId) {
               return {
                   ...category,
                   tasks: category.tasks.filter((task: TTask) => task.id !== taskId),
               };
           }
           return category;
        });

        const newTasksIds = tasksIds.filter((id_y: number) => id_y !== taskId);
        setTasksIds(newTasksIds);
        setCategories(updatedCategories);

        const updCategory = updatedCategories.find((c: TCategory) => c.id === categoryId);
        if (updCategory) {
            localStorage.setItem(String(categoryId), JSON.stringify(updCategory));
        }
    }

    const generateTaskId = () => {
        const newId = tasksIds.length === 0 ? 0 : Math.max(...tasksIds) + 1;
        const newTasksIds = [...tasksIds, newId];
        setTasksIds(newTasksIds);
        localStorage.setItem("tasksIds", JSON.stringify(newTasksIds));

        return newId;
    }

    const onDragEnd = (result: DropResult) => {
        const {destination, source, draggableId} = result;

        if (!destination) {return;}
        if (destination.droppableId === source.droppableId && destination.index === source.index) {return;}

        const startCategoryIndex = categories.findIndex(c => c.id === Number(source.droppableId));
        const finishCategoryIndex = categories.findIndex(c => c.id === Number(destination.droppableId));

        const startCategory = categories[startCategoryIndex];
        const finishCategory = categories[finishCategoryIndex];

        const task = startCategory.tasks.find(task=> task.id === Number(draggableId));

        if (!task) {
            return;
        }

        const newStartTasks = Array.from(startCategory.tasks);
        newStartTasks.splice(source.index, 1);

        const newFinishTasks = Array.from(finishCategory.tasks);
        newFinishTasks.splice(destination.index, 0, task);

        const newCategories = Array.from(categories);
        newCategories[startCategoryIndex] = {
            ...startCategory,
            tasks: newStartTasks,
        };

        newCategories[finishCategoryIndex] = {
            ...finishCategory,
            tasks: newFinishTasks
        };

        setCategories(newCategories);

        localStorage.setItem(String(startCategory.id), JSON.stringify(newCategories[startCategoryIndex]));
        localStorage.setItem(String(finishCategory.id), JSON.stringify(newCategories[finishCategoryIndex]));
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className='container'>
                <div className='categories-container'>
                    {categories.map((category) => (
                        <CategoryColumn key={category.id} category={category} onChange={changeCategoryName}
                                        deleteCategory={handleDeleteCategory} deleteTaskFromCategoryById={deleteTaskFromCategoryById}
                                        generateTaskId={generateTaskId}/>
                    ))}
                    <button className="add-column-btn" onClick={handleAddCategory}>+ Add category</button>
                </div>
            </div>
        </DragDropContext>
    );
}