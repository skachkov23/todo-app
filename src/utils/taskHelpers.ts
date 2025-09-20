import type { Priority, Category, Task } from '../types';

export function getPriorityColor(priority: Priority): string {
    switch (priority) {
        case 'high': return 'bg-danger';
        case 'medium': return 'bg-warning';
        case 'low': return 'bg-success';
        default: return 'bg-secondary';
    }
}

export function getPriorityIcon(priority: Priority): string {
    switch (priority) {
        case 'high': return '🔴';
        case 'medium': return '🟡';
        case 'low': return '🟢';
        default: return '⚫';
    }
}

export function getCategoryColor(category?: Category): string {
    if (!category) return 'bg-secondary';
    switch (category) {
        case 'Work': return 'bg-primary';
        case 'Personal': return 'bg-info';
        case 'Shopping': return 'bg-warning';
        case 'Health': return 'bg-success';
        case 'Study': return 'bg-dark';
        default: return 'bg-secondary';
    }
}

export function getCategoryIcon(category?: Category): string {
    if (!category) return '📁';
    switch (category) {
        case 'Work': return '💼';
        case 'Personal': return '🏠';
        case 'Shopping': return '🛒';
        case 'Health': return '💊';
        case 'Study': return '📚';
        default: return '📁';
    }
}

export function sortTasksByPriority(tasks: Task[]): Task[] {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return [...tasks].sort((a, b) => {
        if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
        }
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
}

export function groupTasksByCategory(tasks: Task[]): Record<string, Task[]> {
    return tasks.reduce((groups, task) => {
        const category = task.category || 'Uncategorized';
        if (!groups[category]) {
        groups[category] = [];
        }
        groups[category].push(task);
        return groups;
    }, {} as Record<string, Task[]>);
}

export function calculateStreak(tasks: Task[]): number {
    const completedDates = tasks
        .filter(task => task.completed && task.completedAt)
        .map(task => new Date(task.completedAt!).toDateString())
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    if (completedDates.length === 0) return 0;

    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    let streak = 0;
    let currentDate = completedDates.includes(today) ? today : yesterday;
    
    while (completedDates.includes(currentDate)) {
        streak++;
        const prevDay = new Date(new Date(currentDate).getTime() - 86400000);
        currentDate = prevDay.toDateString();
    }
    return streak;
}