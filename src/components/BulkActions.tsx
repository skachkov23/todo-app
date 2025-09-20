import React from 'react';
import { exportTasks, importTasks } from '../utils/exportImport';
import type { Task } from '../types';

interface BulkActionsProps {
    selectedTasks: number[];
    setSelectedTasks: (tasks: number[]) => void;
    allTaskIds: number[];
    onToggleSelected: (completed: boolean) => void;
    onDeleteSelected: () => void;
    onClearAll: () => void;
    tasks: Task[];
    onImport: (tasks: Task[]) => void;
    showToast: (message: string, type?: 'success' | 'error') => void;
    }

    export const BulkActions: React.FC<BulkActionsProps> = ({
    selectedTasks,
    setSelectedTasks,
    allTaskIds,
    onToggleSelected,
    onDeleteSelected,
    onClearAll,
    tasks,
    onImport,
    showToast
    }) => {
    const isAllSelected = selectedTasks.length === allTaskIds.length && allTaskIds.length > 0;
    const isPartiallySelected = selectedTasks.length > 0 && selectedTasks.length < allTaskIds.length;

    const handleSelectAll = () => {
        if (isAllSelected) {
        setSelectedTasks([]);
        } else {
        setSelectedTasks(allTaskIds);
        }
    };

    const handleExport = () => {
        exportTasks(tasks);
        showToast('Tasks exported successfully!', 'success');
    };

    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const importedTasks = await importTasks(file);
                onImport(importedTasks);
                showToast('Tasks imported successfully!', 'success');
            } catch (error) {
                showToast('Error importing tasks', 'error');
            }
                event.target.value = '';
        }
    };

    return (
        <div className="card border-0 shadow-lg mb-4">
            <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0">
                        <i className="fas fa-tasks text-primary me-2"></i>
                        Bulk Actions
                    </h5>
                    <div className="dropdown">
                        <button 
                        className="btn btn-outline-secondary btn-sm dropdown-toggle" 
                        type="button" 
                        data-bs-toggle="dropdown"
                        >
                        <i className="fas fa-cog me-1"></i>
                        Settings
                        </button>
                        <ul className="dropdown-menu">
                        <li>
                            <button className="dropdown-item" onClick={handleExport}>
                            <i className="fas fa-download me-2"></i>
                            Export Tasks
                            </button>
                        </li>
                        <li>
                            <label className="dropdown-item" style={{ cursor: 'pointer' }}>
                            <i className="fas fa-upload me-2"></i>
                            Import Tasks
                            <input 
                                type="file" 
                                accept=".json" 
                                onChange={handleImport} 
                                style={{ display: 'none' }} 
                            />
                            </label>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                            <button 
                            className="dropdown-item text-danger" 
                            onClick={onClearAll}
                            disabled={tasks.length === 0}
                            >
                            <i className="fas fa-trash me-2"></i>
                            Clear All Tasks
                            </button>
                        </li>
                        </ul>
                    </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                <div className="form-check">
                    <input 
                    type="checkbox" 
                    className="form-check-input"
                    checked={isAllSelected}
                    ref={(el) => {
                        if (el) {
                        el.indeterminate = isPartiallySelected;
                        }
                    }}
                    onChange={handleSelectAll}
                    disabled={allTaskIds.length === 0}
                    />
                    <label className="form-check-label">
                    Select All {allTaskIds.length > 0 && `(${allTaskIds.length})`}
                    </label>
                </div>
                {selectedTasks.length > 0 && (
                    <div className="btn-group btn-group-sm">
                        <button 
                            className="btn btn-success"
                            onClick={() => onToggleSelected(true)}
                            title={`Mark ${selectedTasks.length} tasks as complete`}
                        >
                            <i className="fas fa-check me-1"></i>
                            Complete ({selectedTasks.length})
                        </button>
                        <button 
                            className="btn btn-warning"
                            onClick={() => onToggleSelected(false)}
                            title={`Mark ${selectedTasks.length} tasks as pending`}
                        >
                            <i className="fas fa-undo me-1"></i>
                            Undo
                        </button>
                        <button 
                            className="btn btn-danger"
                            onClick={onDeleteSelected}
                            title={`Delete ${selectedTasks.length} selected tasks`}
                        >
                            <i className="fas fa-trash me-1"></i>
                            Delete
                        </button>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
};