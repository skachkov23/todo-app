import React, { useState, useMemo } from 'react';
import { useTaskManager } from '../hooks/useTaskManager';
import { useTheme } from '../hooks/useTheme';
import { sortTasksByPriority, groupTasksByCategory, getCategoryIcon } from '../utils/taskHelpers';
import { TaskStatsComponent } from './TaskStats';
import { TaskForm } from './TaskForm';
import { SearchAndFilters } from './SearchAndFilters';
import { BulkActions } from './BulkActions';
import { TaskItem } from './TaskItem';
import { EmptyState } from './EmptyState';
import type { Task, FilterType } from '../types';

export const TodoApp: React.FC = () => {
    const { 
        tasks, 
        addTask, 
        deleteTask, 
        deleteTasks,
        toggleTask, 
        toggleTasks,
        reorderTasks,
        stats, 
        isLoading 
    } = useTaskManager();

    const { darkMode, toggleTheme } = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<FilterType>('all');
    const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
    const [groupByCategory, setGroupByCategory] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const filteredTasks = useMemo(() => {
        return tasks
        .filter(task => task.text.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(task => {
            if (filter === 'pending') return !task.completed;
            if (filter === 'completed') return task.completed;
            return true;
        });
    }, [tasks, searchTerm, filter]);

    const sortedTasks = useMemo(() => {
        return sortTasksByPriority(filteredTasks);
    }, [filteredTasks]);

    const taskCounts = useMemo(() => ({
        all: filteredTasks.length,
        pending: filteredTasks.filter(task => !task.completed).length,
        completed: filteredTasks.filter(task => task.completed).length
    }), [filteredTasks]);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSelectTask = (taskId: number, selected: boolean) => {
        if (selected) {
        setSelectedTasks([...selectedTasks, taskId]);
        } else {
        setSelectedTasks(selectedTasks.filter(id => id !== taskId));
        }
    };

    const handleToggleSelected = (completed: boolean) => {
        toggleTasks(selectedTasks, completed);
        setSelectedTasks([]);
        showToast(`${selectedTasks.length} tasks ${completed ? 'completed' : 'marked as pending'}!`);
    };

    const handleDeleteSelected = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedTasks.length} selected tasks?`)) {
        deleteTasks(selectedTasks);
        setSelectedTasks([]);
        showToast(`${selectedTasks.length} tasks deleted!`);
        }
    };

    const handleClearAll = () => {
        if (window.confirm('Are you sure you want to delete ALL tasks? This cannot be undone.')) {
        deleteTasks(tasks.map(task => task.id));
        setSelectedTasks([]);
        showToast('All tasks cleared!');
        }
    };

    const handleImport = (importedTasks: Task[]) => {
        const newTasks = importedTasks.map(task => ({
        ...task,
        id: Date.now() + Math.random(),
        order: tasks.length + importedTasks.indexOf(task)
        }));
        console.log('Imported tasks:', newTasks);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilter('all');
    };

    const hasActiveFilters = searchTerm.trim() !== '' || filter !== 'all';
    const handleDragStart = (e: React.DragEvent, taskId: number) => {
        e.dataTransfer.setData('text/plain', taskId.toString());
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDrop = (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault();
        const draggedId = parseInt(e.dataTransfer.getData('text/plain'));
        if (draggedId) {
        reorderTasks(draggedId, targetIndex);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const incompleteTasks = sortedTasks.filter(task => !task.completed);
    const completedTasks = sortedTasks.filter(task => task.completed);

    return (
        <div className={`min-vh-100 ${darkMode ? 'bg-dark' : 'bg-primary bg-gradient'}`}>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-10 col-xl-8">
                        {toast && (
                        <div 
                            className={`position-fixed top-0 end-0 m-3 alert alert-${toast.type === 'error' ? 'danger' : 'success'} alert-dismissible fade show`}
                            style={{ zIndex: 1050 }}
                        >
                            <i className={`fas ${toast.type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'} me-2`}></i>
                            {toast.message}
                            <button 
                            type="button" 
                            className="btn-close" 
                            onClick={() => setToast(null)}
                            ></button>
                        </div>
                        )}
                        <TaskStatsComponent stats={stats} darkMode={darkMode} onToggleTheme={toggleTheme} />
                        <TaskForm onAddTask={addTask} isLoading={isLoading} />
                        <SearchAndFilters
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filter={filter}
                        setFilter={setFilter}
                        taskCounts={taskCounts}
                        />
                        <BulkActions
                        selectedTasks={selectedTasks}
                        setSelectedTasks={setSelectedTasks}
                        allTaskIds={filteredTasks.map(task => task.id)}
                        onToggleSelected={handleToggleSelected}
                        onDeleteSelected={handleDeleteSelected}
                        onClearAll={handleClearAll}
                        tasks={tasks}
                        onImport={handleImport}
                        showToast={showToast}
                        />
                        {filteredTasks.length > 0 && (
                        <div className="card border-0 shadow-lg mb-4">
                            <div className="card-body p-3">
                            <div className="form-check form-switch">
                                <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id="groupByCategory"
                                checked={groupByCategory}
                                onChange={(e) => setGroupByCategory(e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="groupByCategory">
                                <i className="fas fa-layer-group me-2"></i>
                                Group by Category
                                </label>
                            </div>
                            </div>
                        </div>
                        )}
                        {sortedTasks.length === 0 ? (
                        <EmptyState hasFilters={hasActiveFilters} onClearFilters={clearFilters} />
                        ) : (
                        <>
                            {incompleteTasks.length > 0 && (
                            <div className="card border-0 shadow-lg mb-4">
                                <div className="card-body p-4">
                                <h5 className="card-title mb-4">
                                    <i className="fas fa-clock text-warning me-2"></i>
                                    Pending Tasks ({incompleteTasks.length})
                                </h5>
                                
                                <div className="list-group list-group-flush">
                                    {groupByCategory ? (
                                    Object.entries(groupTasksByCategory(incompleteTasks)).map(([categoryName, categoryTasks]) => (
                                        <div key={categoryName}>
                                        <h6 className="text-muted mt-3 mb-2">
                                            {getCategoryIcon(categoryName as any)} {categoryName}
                                        </h6>
                                        {categoryTasks.map((task, index) => (
                                            <TaskItem
                                            key={task.id}
                                            task={task}
                                            onToggle={toggleTask}
                                            onDelete={deleteTask}
                                            isSelected={selectedTasks.includes(task.id)}
                                            onSelect={handleSelectTask}
                                            onDragStart={handleDragStart}
                                            onDrop={handleDrop}
                                            onDragOver={handleDragOver}
                                            index={index}
                                            />
                                        ))}
                                        </div>
                                    ))
                                    ) : (
                                    incompleteTasks.map((task, index) => (
                                        <TaskItem
                                        key={task.id}
                                        task={task}
                                        onToggle={toggleTask}
                                        onDelete={deleteTask}
                                        isSelected={selectedTasks.includes(task.id)}
                                        onSelect={handleSelectTask}
                                        onDragStart={handleDragStart}
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        index={index}
                                        />
                                    ))
                                    )}
                                </div>
                                </div>
                            </div>
                            )}
                            {completedTasks.length > 0 && (
                            <div className="card border-0 shadow-lg mb-4">
                                <div className="card-body p-4">
                                <h5 className="card-title mb-4">
                                    <i className="fas fa-check-circle text-success me-2"></i>
                                    Completed Tasks ({completedTasks.length})
                                </h5>
                                
                                <div className="list-group list-group-flush">
                                    {completedTasks.map(task => (
                                    <TaskItem
                                        key={task.id}
                                        task={task}
                                        onToggle={toggleTask}
                                        onDelete={deleteTask}
                                        isSelected={selectedTasks.includes(task.id)}
                                        onSelect={handleSelectTask}
                                        isDraggable={false}
                                    />
                                    ))}
                                </div>
                                </div>
                            </div>
                            )}
                        </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
