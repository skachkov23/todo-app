export function validateTaskInput(text: string): boolean {
    const trimmed = text.trim();
    
    if (!trimmed) return false;
    if (trimmed.length < 3) return false;
    if (/^\d+$/.test(trimmed)) return false;
    
    return true;
}

export function getValidationMessage(text: string): string {
    const trimmed = text.trim();
    
    if (!trimmed) {
        return 'Please enter a task description';
    }
    
    if (trimmed.length < 3) {
        return 'Task must be at least 3 characters long';
    }
    
    if (/^\d+$/.test(trimmed)) {
        return 'Task cannot contain only numbers';
    }
    
    return '';
}
