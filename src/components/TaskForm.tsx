import React, { useState } from 'react';
import { getValidationMessage } from '../utils/validation';
import type { ValidationError, Priority, Category } from '../types';

const CATEGORIES: Category[] = ['Work', 'Personal', 'Shopping', 'Health', 'Study'];

interface TaskFormProps {
    onAddTask: (text: string, priority: Priority, category?: Category, dueDate?: string) => Promise<boolean>;
    isLoading: boolean;
}

    export const TaskForm: React.FC<TaskFormProps> = ({ onAddTask, isLoading }) => {
    const [inputValue, setInputValue] = useState('');
    const [priority, setPriority] = useState<Priority>('medium');
    const [category, setCategory] = useState<Category | ''>('');
    const [dueDate, setDueDate] = useState('');
    const [validation, setValidation] = useState<ValidationError | null>(null);

    const handleSubmit = async () => {
        const errorMessage = getValidationMessage(inputValue);
        if (errorMessage) {
            setValidation({ message: errorMessage, type: 'error' });
            return;
        }

        const success = await onAddTask(
        inputValue, 
        priority, 
        category || undefined, 
        dueDate || undefined
        );
        if (success) {
            setInputValue('');
            setPriority('medium');
            setCategory('');
            setDueDate('');
            setValidation({ message: 'Task added successfully!', type: 'success' });
            setTimeout(() => setValidation(null), 2000);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);
        return tomorrow.toISOString().slice(0, 16);
    };

    return (
        <div className="card border-0 shadow-lg mb-4">
            <div className="card-body p-4">
                <h5 className="card-title mb-3">
                <i className="fas fa-plus-circle text-primary me-2"></i>
                Add New Task
                </h5>
                <div className="mb-3">
                    <div className="input-group input-group-lg">
                        <span className="input-group-text bg-light border-end-0">
                        <i className="fas fa-edit text-muted"></i>
                        </span>
                        <input
                        type="text"
                        className={`form-control bg-light border-start-0 ${
                            validation?.type === 'error' ? 'is-invalid' : 
                            validation?.type === 'success' ? 'is-valid' : ''
                        }`}
                        placeholder="What needs to be done?"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                        />
                    </div>
                </div>
                <div className="row g-2 mb-3">
                    <div className="col-md-4">
                        <label className="form-label small text-muted">Priority</label>
                        <select 
                        className="form-select" 
                        value={priority} 
                        onChange={(e) => setPriority(e.target.value as Priority)}
                        disabled={isLoading}
                        >
                        <option value="low">🟢 Low Priority</option>
                        <option value="medium">🟡 Medium Priority</option>
                        <option value="high">🔴 High Priority</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label small text-muted">Category</label>
                        <select 
                        className="form-select" 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value as Category | '')}
                        disabled={isLoading}
                        >
                        <option value="">📁 No Category</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>
                            {cat === 'Work' && '💼'} 
                            {cat === 'Personal' && '🏠'} 
                            {cat === 'Shopping' && '🛒'} 
                            {cat === 'Health' && '💊'} 
                            {cat === 'Study' && '📚'} 
                            {' '}{cat}
                            </option>
                        ))}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label small text-muted">Due Date</label>
                        <input 
                        type="datetime-local" 
                        className="form-select"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                        disabled={isLoading}
                        />
                    </div>
                </div>
                <div className="d-flex gap-2 mb-3">
                    <button 
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => setDueDate(getTomorrowDate())}
                        disabled={isLoading}
                    >
                        📅 Tomorrow 6 AM
                    </button>
                    <button 
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => setDueDate('')}
                        disabled={isLoading || !dueDate}
                    >
                        🗑️ Clear Date
                    </button>
                </div>
                <div className="d-grid">
                <button 
                    type="button" 
                    className="btn btn-primary btn-lg"
                    onClick={handleSubmit}
                    disabled={isLoading || !inputValue.trim()}
                >
                    {isLoading ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Adding Task...
                    </>
                    ) : (
                    <>
                        <i className="fas fa-plus me-2"></i>
                        Add Task
                    </>
                    )}
                </button>
                </div>
                {validation && (
                <div className={`alert alert-${validation.type === 'error' ? 'danger' : 'success'} d-flex align-items-center mt-3 mb-0`}>
                    <i className={`fas ${validation.type === 'error' ? 'fa-exclamation-triangle' : 'fa-check-circle'} me-2`}></i>
                    {validation.message}
                </div>
                )}
            </div>
        </div>
    );
};