import React from 'react';
import type { FilterType } from '../types';

interface SearchAndFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filter: FilterType;
    setFilter: (filter: FilterType) => void;
    taskCounts: {
        all: number;
        pending: number;
        completed: number;
    };
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    taskCounts
    }) => {
    return (
        <div className="card border-0 shadow-lg mb-4">
            <div className="card-body p-4">
                <h5 className="card-title mb-3">
                <i className="fas fa-filter text-primary me-2"></i>
                Search & Filter
                </h5>
                <div className="input-group mb-3">
                    <span className="input-group-text bg-light">
                        <i className="fas fa-search text-muted"></i>
                    </span>
                    <input 
                        type="text" 
                        className="form-control bg-light border-start-0" 
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button 
                        className="btn btn-outline-secondary"
                        onClick={() => setSearchTerm('')}
                        >
                        <i className="fas fa-times"></i>
                        </button>
                    )}
                </div>
                <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                    <button 
                        className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'} flex-fill`}
                        onClick={() => setFilter('all')}
                    >
                        <i className="fas fa-list me-1"></i>
                        All ({taskCounts.all})
                    </button>
                    <button 
                        className={`btn ${filter === 'pending' ? 'btn-warning' : 'btn-outline-warning'} flex-fill`}
                        onClick={() => setFilter('pending')}
                    >
                        <i className="fas fa-clock me-1"></i>
                        Pending ({taskCounts.pending})
                    </button>
                    <button 
                        className={`btn ${filter === 'completed' ? 'btn-success' : 'btn-outline-success'} flex-fill`}
                        onClick={() => setFilter('completed')}
                    >
                        <i className="fas fa-check-circle me-1"></i>
                        Done ({taskCounts.completed})
                    </button>
                </div>
            </div>
        </div>
    );
};
