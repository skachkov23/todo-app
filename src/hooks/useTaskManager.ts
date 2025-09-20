import { useState, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { validateTaskInput } from '../utils/validation';
import { formatDateTime, isOverdue, isThisWeek } from '../utils/dateFormatter';
import { calculateStreak } from '../utils/taskHelpers';
import type { Task, TaskStats, UseTaskManagerReturn, Priority, Category } from '../types';

export function useTaskManager(): UseTaskManagerReturn {
    const [tasks, setTasks] = useLocalStorage<Task[]>('enhancedTodoTasks', []);
    const [isLoading, setIsLoading] = useState(false);

    const stats: TaskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const today = new Date().toDateString();
    const todayCompleted = tasks.filter(task => 
        task.completed && task.completedAt && 
        new Date(task.completedAt).toDateString() === today
    ).length;

    const weeklyCompleted = tasks.filter(task => 
        task.completed && task.completedAt && isThisWeek(task.completedAt)
    ).length;
    
    const overdue = tasks.filter(task => 
        !task.completed && task.dueDate && isOverdue(task.dueDate)
    ).length;

    const streak = calculateStreak(tasks);

    return { 
        total, 
        completed, 
        pending, 
        completionRate, 
        todayCompleted, 
        weeklyCompleted, 
        streak,
        overdue
        };
    }, [tasks]);

    const addTask = async (
        text: string, 
        priority: Priority, 
        category?: Category, 
        dueDate?: string
    ): Promise<boolean> => {
        if (!validateTaskInput(text)) {
        return false;
    }

    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 300));

    const newTask: Task = {
        id: Date.now(),
        text: text.trim(),
        completed: false,
        createdAt: formatDateTime(new Date()),
        priority,
        category,
        dueDate,
        order: tasks.length,
        };

        setTasks(prevTasks => [newTask, ...prevTasks]);
        setIsLoading(false);
        return true;
    };

    const deleteTask = (id: number): void => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    };

    const deleteTasks = (ids: number[]): void => {
        setTasks(prevTasks => prevTasks.filter(task => !ids.includes(task.id)));
    };

    const toggleTask = (id: number): void => {
        setTasks(prevTasks =>
        prevTasks.map(task =>
            task.id === id 
            ? { 
                ...task, 
                completed: !task.completed,
                completedAt: !task.completed ? formatDateTime(new Date()) : undefined
                } 
            : task
        )
        );
    };

    const toggleTasks = (ids: number[], completed: boolean): void => {
        setTasks(prevTasks =>
        prevTasks.map(task =>
            ids.includes(task.id)
            ? { 
                ...task, 
                completed,
                completedAt: completed ? formatDateTime(new Date()) : undefined
                }
            : task
        )
        );
    };

    const reorderTasks = (draggedId: number, targetIndex: number): void => {
        setTasks(prevTasks => {
        const draggedTask = prevTasks.find(task => task.id === draggedId);
        if (!draggedTask) return prevTasks;

        const filteredTasks = prevTasks.filter(task => task.id !== draggedId);
        const newTasks = [...filteredTasks];
        newTasks.splice(targetIndex, 0, draggedTask);
        
        return newTasks.map((task, index) => ({ ...task, order: index }));
        });
    };

    return {
        tasks,
        addTask,
        deleteTask,
        deleteTasks,
        toggleTask,
        toggleTasks,
        reorderTasks,
        stats,
        isLoading
    };
}
