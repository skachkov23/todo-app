import React from 'react';
import { formatDueDate, isOverdue } from '../utils/dateFormatter';
import { getPriorityColor, getPriorityIcon, getCategoryColor, getCategoryIcon } from '../utils/taskHelpers';
import type { Task } from '../types';

interface TaskItemProps {
    task: Task;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
    isSelected: boolean;
    onSelect: (id: number, selected: boolean) => void;
    isDraggable?: boolean;
    onDragStart?: (e: React.DragEvent, taskId: number) => void;
    onDrop?: (e: React.DragEvent, targetIndex: number) => void;
    onDragOver?: (e: React.DragEvent) => void;
    index?: number;
}

    export const TaskItem: React.FC<TaskItemProps> = ({
    task,
    onToggle,
    onDelete,
    isSelected,
    onSelect,
    isDraggable = true,
    onDragStart,
    onDrop,
    onDragOver,
    index = 0
    }) => {
    const isTaskOverdue = task.dueDate && !task.completed && isOverdue(task.dueDate);

    return (
        <div 
        className={`list-group-item d-flex align-items-center ${
            task.completed ? 'bg-light bg-opacity-50' : ''
        } ${isTaskOverdue ? 'border-start border-danger border-3' : ''}`}
        draggable={isDraggable && !task.completed}
        onDragStart={onDragStart ? (e) => onDragStart(e, task.id) : undefined}
        onDrop={onDrop ? (e) => onDrop(e, index) : undefined}
        onDragOver={onDragOver}
        style={{ 
            cursor: isDraggable && !task.completed ? 'grab' : 'default',
            opacity: task.completed ? 0.7 : 1
        }}
        >
            <div className="form-check me-3">
                <input
                type="checkbox"
                className="form-check-input"
                checked={isSelected}
                onChange={(e) => onSelect(task.id, e.target.checked)}
                />
            </div>
            <div className="form-check me-3">
                <input
                type="checkbox"
                className="form-check-input"
                checked={task.completed}
                onChange={() => onToggle(task.id)}
                id={`task-${task.id}`}
                />
            </div>
            <div className="flex-grow-1">
                <label htmlFor={`task-${task.id}`} className="form-check-label mb-0">
                    <div className={`d-flex align-items-center gap-2 mb-1`}>
                        <span className={`badge ${getPriorityColor(task.priority)} text-white`}>
                        {getPriorityIcon(task.priority)}
                        </span>
                        {task.category && (
                        <span className={`badge ${getCategoryColor(task.category)} text-white`}>
                            {getCategoryIcon(task.category)} {task.category}
                        </span>
                        )}
                        <span className={`fw-medium ${
                        task.completed 
                            ? 'text-muted text-decoration-line-through' 
                            : isTaskOverdue 
                            ? 'text-danger' 
                            : 'text-dark'
                        }`}>
                        {task.text}
                        </span>
                        {isTaskOverdue && (
                        <span className="badge bg-danger">
                            <i className="fas fa-exclamation-triangle me-1"></i>
                            Overdue!
                        </span>
                        )}
                    </div>
                    <div className="d-flex flex-wrap gap-3">
                        <small className="text-muted">
                        <i className="fas fa-calendar-alt me-1"></i>
                        Created {task.createdAt}
                        </small>
                        {task.dueDate && (
                        <small className={isTaskOverdue ? 'text-danger fw-bold' : 'text-muted'}>
                            <i className="fas fa-clock me-1"></i>
                            {formatDueDate(task.dueDate)}
                        </small>
                        )}
                        {task.completed && task.completedAt && (
                        <small className="text-success">
                            <i className="fas fa-check-circle me-1"></i>
                            Completed {task.completedAt}
                        </small>
                        )}
                    </div>
                </label>
            </div>
            {isDraggable && !task.completed && (
                <div className="text-muted me-2" style={{ cursor: 'grab' }}>
                    <i className="fas fa-grip-vertical"></i>
                </div>
            )}
            <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => onDelete(task.id)}
                title="Delete task"
            >
                <i className="fas fa-trash"></i>
            </button>
        </div>
    );
};