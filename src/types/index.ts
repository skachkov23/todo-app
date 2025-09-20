export type Priority = 'low' | 'medium' | 'high';
export type Category = 'Work' | 'Personal' | 'Shopping' | 'Health' | 'Study';
export type FilterType = 'all' | 'pending' | 'completed';

export interface Task {
    id: number;
    text: string;
    completed: boolean;
    createdAt: string;
    completedAt?: string;
    priority: Priority;
    category?: Category;
    dueDate?: string;
    order: number;
}

export interface ValidationError {
    message: string;
    type: 'error' | 'success' | 'warning';
}

export interface TaskStats {
    total: number;
    completed: number;
    pending: number;
    completionRate: number;
    todayCompleted: number;
    weeklyCompleted: number;
    streak: number;
    overdue: number;
}

export interface UseTaskManagerReturn {
    tasks: Task[];
    addTask: (text: string, priority: Priority, category?: Category, dueDate?: string) => Promise<boolean>;
    deleteTask: (id: number) => void;
    deleteTasks: (ids: number[]) => void;
    toggleTask: (id: number) => void;
    toggleTasks: (ids: number[], completed: boolean) => void;
    reorderTasks: (draggedId: number, targetIndex: number) => void;
    stats: TaskStats;
    isLoading: boolean;
}
