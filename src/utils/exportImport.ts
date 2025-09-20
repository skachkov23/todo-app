import type { Task } from '../types';

export function exportTasks(tasks: Task[]): void {
    const dataStr = JSON.stringify({
        tasks,
        exportedAt: new Date().toISOString(),
        version: '2.0'
    }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `enhanced-todos-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export function importTasks(file: File): Promise<Task[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const result = e.target?.result as string;
                const parsed = JSON.parse(result);
                const tasks = parsed.tasks || parsed;
                if (!Array.isArray(tasks)) {
                throw new Error('Invalid file format');
                }
                resolve(tasks);
            } catch (error) {
                reject(new Error('Failed to parse file'));
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
}