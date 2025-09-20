import React from 'react';
import type { TaskStats } from '../types';

interface TaskStatsProps {
    stats: TaskStats;
    darkMode: boolean;
    onToggleTheme: () => void;
}

export const TaskStatsComponent: React.FC<TaskStatsProps> = ({ stats, darkMode, onToggleTheme }) => {
    const { total, pending, completed, completionRate, todayCompleted, weeklyCompleted, streak, overdue } = stats;

    return (
        <div className="card border-0 shadow-lg mb-4">
            <div className="card-body text-center py-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <i className="fas fa-tasks text-primary" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={onToggleTheme}
                        title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
                    >
                        {darkMode ? '☀️' : '🌙'}
                    </button>
                </div>
                
                <h1 className="h2 mb-4">Todo App</h1>
                <div className="row g-3 mb-4">
                    <div className="col-6 col-md-3">
                        <div className="bg-primary bg-opacity-10 rounded p-3">
                        <div className="h4 text-primary mb-1">{total}</div>
                        <small className="text-muted">Total</small>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="bg-warning bg-opacity-10 rounded p-3">
                        <div className="h4 text-warning mb-1">{pending}</div>
                        <small className="text-muted">Pending</small>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="bg-success bg-opacity-10 rounded p-3">
                        <div className="h4 text-success mb-1">{completed}</div>
                        <small className="text-muted">Done</small>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="bg-danger bg-opacity-10 rounded p-3">
                        <div className="h4 text-danger mb-1">{overdue}</div>
                        <small className="text-muted">Overdue</small>
                        </div>
                    </div>
                </div>
                <div className="row g-2 mb-4">
                    <div className="col-4">
                        <div className="bg-info bg-opacity-10 rounded p-2">
                        <div className="h6 text-info mb-0">🔥 {streak}</div>
                        <small className="text-muted">Day Streak</small>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="bg-success bg-opacity-10 rounded p-2">
                        <div className="h6 text-success mb-0">📅 {todayCompleted}</div>
                        <small className="text-muted">Today</small>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="bg-primary bg-opacity-10 rounded p-2">
                        <div className="h6 text-primary mb-0">📊 {weeklyCompleted}</div>
                        <small className="text-muted">This Week</small>
                        </div>
                    </div>
                </div>
                {total > 0 && (
                <div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                    <small className="text-muted">Overall Progress</small>
                    <small className="text-muted">{completionRate}%</small>
                    </div>
                    <div className="progress mb-2">
                    <div 
                        className="progress-bar bg-primary" 
                        role="progressbar"
                        style={{ width: `${completionRate}%` }}
                        aria-valuenow={completionRate}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    ></div>
                    </div>
                    {completionRate === 100 && (
                    <div className="alert alert-success mb-0">
                        🎉 Congratulations! All tasks completed!
                    </div>
                    )}
                </div>
                )}
            </div>
        </div>
    );
};
