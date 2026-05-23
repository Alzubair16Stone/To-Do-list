export interface Task {
    id: string;
    title: string;
    description?: string;
    category: string;
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
    isCompleted: boolean;
    createdAt: string;
}
