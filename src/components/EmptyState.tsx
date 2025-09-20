import React from 'react';

interface EmptyStateProps {
    hasFilters?: boolean;
    onClearFilters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ hasFilters, onClearFilters }) => {
    if (hasFilters) {
        return (
        <div className="card border-0 shadow-lg">
            <div className="card-body text-center py-5">
            <div className="mb-4">
                <i className="fas fa-search text-muted" style={{ fontSize: '4rem' }}></i>
            </div>
            <h4 className="text-muted mb-3">No tasks found!</h4>
            <p className="text-muted mb-4">
                No tasks match your current search or filter criteria.
            </p>
            <button 
                className="btn btn-primary"
                onClick={onClearFilters}
            >
                <i className="fas fa-times me-2"></i>
                Clear Filters
            </button>
            </div>
        </div>
        );
    }

    return (
        <div className="card border-0 shadow-lg">
        <div className="card-body text-center py-5">
            <div className="mb-4">
            <i className="fas fa-clipboard-list text-muted" style={{ fontSize: '4rem' }}></i>
            </div>
            <h4 className="text-muted mb-3">No tasks yet!</h4>
            <p className="text-muted mb-4">
            Start by adding your first task above.<br/>
            Stay organized and get things done! 🚀
            </p>
            
            <div className="row g-3">
            <div className="col-md-6">
                <div className="alert alert-info">
                <i className="fas fa-lightbulb me-2"></i>
                <strong>Tip:</strong> Use priorities and categories to organize your tasks!
                </div>
            </div>
            <div className="col-md-6">
                <div className="alert alert-success">
                <i className="fas fa-calendar me-2"></i>
                <strong>Pro tip:</strong> Set due dates to stay on track!
                </div>
            </div>
            </div>
        </div>
        </div>
    );
};