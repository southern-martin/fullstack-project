import React, { useState } from 'react';
import {
    PlusIcon,
    CheckCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    XCircleIcon,
    UserIcon,
    CalendarIcon,
    TagIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';

interface Task {
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assignee: string;
    dueDate: string;
    tags: string[];
    progress: number;
}

const TaskKanban: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([
        {
            id: 'TASK-001',
            title: 'Design new landing page',
            description: 'Create a modern and responsive landing page for the new product launch',
            status: 'in-progress',
            priority: 'high',
            assignee: 'Sarah Johnson',
            dueDate: '2024-01-20',
            tags: ['design', 'frontend', 'ui'],
            progress: 65,
        },
        {
            id: 'TASK-002',
            title: 'Implement user authentication',
            description: 'Add JWT-based authentication system with role-based access control',
            status: 'todo',
            priority: 'urgent',
            assignee: 'Mike Chen',
            dueDate: '2024-01-18',
            tags: ['backend', 'security', 'auth'],
            progress: 0,
        },
        {
            id: 'TASK-003',
            title: 'Write API documentation',
            description: 'Create comprehensive API documentation with examples and code snippets',
            status: 'completed',
            priority: 'medium',
            assignee: 'Emily Davis',
            dueDate: '2024-01-15',
            tags: ['documentation', 'api'],
            progress: 100,
        },
        {
            id: 'TASK-004',
            title: 'Setup CI/CD pipeline',
            description: 'Configure automated testing and deployment pipeline for the project',
            status: 'in-progress',
            priority: 'high',
            assignee: 'David Wilson',
            dueDate: '2024-01-22',
            tags: ['devops', 'ci-cd', 'automation'],
            progress: 40,
        },
        {
            id: 'TASK-005',
            title: 'Optimize database queries',
            description: 'Review and optimize slow database queries to improve performance',
            status: 'todo',
            priority: 'medium',
            assignee: 'John Smith',
            dueDate: '2024-01-25',
            tags: ['database', 'performance', 'optimization'],
            progress: 0,
        },
        {
            id: 'TASK-006',
            title: 'Create user onboarding flow',
            description: 'Design and implement a smooth user onboarding experience',
            status: 'cancelled',
            priority: 'low',
            assignee: 'Jane Doe',
            dueDate: '2024-01-30',
            tags: ['ux', 'onboarding', 'user-experience'],
            progress: 20,
        },
    ]);

    const columns = [
        { id: 'todo', title: 'To Do', color: 'gray', icon: ClockIcon },
        { id: 'in-progress', title: 'In Progress', color: 'blue', icon: ExclamationTriangleIcon },
        { id: 'completed', title: 'Completed', color: 'green', icon: CheckCircleIcon },
        { id: 'cancelled', title: 'Cancelled', color: 'red', icon: XCircleIcon },
    ];

    const getPriorityBadge = (priority: string) => {
        const priorityClasses = {
            low: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
            medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
            high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
            urgent: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
        };

        return (
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${priorityClasses[priority as keyof typeof priorityClasses]}`}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    const getColumnStats = (status: string) => {
        return tasks.filter(task => task.status === status).length;
    };

    const getColumnColor = (color: string) => {
        const colorClasses = {
            gray: 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800',
            blue: 'border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20',
            green: 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/20',
            red: 'border-red-200 bg-red-50 dark:border-red-700 dark:bg-red-900/20',
        };
        return colorClasses[color as keyof typeof colorClasses];
    };

    const getColumnHeaderColor = (color: string) => {
        const colorClasses = {
            gray: 'text-gray-600 dark:text-gray-400',
            blue: 'text-blue-600 dark:text-blue-400',
            green: 'text-green-600 dark:text-green-400',
            red: 'text-red-600 dark:text-red-400',
        };
        return colorClasses[color as keyof typeof colorClasses];
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Kanban Board</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Visual task management with drag and drop</p>
                </div>
                
                <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        <PlusIcon className="h-4 w-4" />
                        <span>Add Task</span>
                    </button>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                {columns.map((column) => {
                    const columnTasks = tasks.filter(task => task.status === column.id);
                    const Icon = column.icon;
                    
                    return (
                        <div key={column.id} className={`rounded-lg border-2 ${getColumnColor(column.color)}`}>
                            {/* Column Header */}
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center space-x-2">
                                    <Icon className={`h-5 w-5 ${getColumnHeaderColor(column.color)}`} />
                                    <h3 className={`font-semibold ${getColumnHeaderColor(column.color)}`}>
                                        {column.title}
                                    </h3>
                                </div>
                                <span className={`rounded-full px-2 py-1 text-xs font-medium ${getColumnHeaderColor(column.color)} bg-white/50 dark:bg-gray-800/50`}>
                                    {getColumnStats(column.id)}
                                </span>
                            </div>

                            {/* Tasks */}
                            <div className="min-h-[400px] p-4 space-y-3">
                                {columnTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow dark:border-gray-700 dark:bg-gray-800"
                                    >
                                        {/* Task Header */}
                                        <div className="mb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {task.title}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        {task.id}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                                        <EyeIcon className="h-4 w-4" />
                                                    </button>
                                                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                                        <PencilIcon className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Task Description */}
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                            {task.description}
                                        </p>

                                        {/* Priority Badge */}
                                        <div className="mb-3">
                                            {getPriorityBadge(task.priority)}
                                        </div>

                                        {/* Progress Bar */}
                                        {task.progress > 0 && (
                                            <div className="mb-3">
                                                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                    <span>Progress</span>
                                                    <span>{task.progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                                                    <div 
                                                        className="bg-blue-600 h-1.5 rounded-full" 
                                                        style={{ width: `${task.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Tags */}
                                        <div className="mb-3 flex flex-wrap gap-1">
                                            {task.tags.slice(0, 2).map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                            {task.tags.length > 2 && (
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    +{task.tags.length - 2} more
                                                </span>
                                            )}
                                        </div>

                                        {/* Task Footer */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                                                    <UserIcon className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                                                </div>
                                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                                    {task.assignee.split(' ')[0]}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                                                <CalendarIcon className="h-3 w-3" />
                                                <span>{formatDate(task.dueDate)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Add Task Button */}
                                <button className="w-full rounded-lg border-2 border-dashed border-gray-300 p-4 text-center hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500">
                                    <div className="flex flex-col items-center space-y-2">
                                        <PlusIcon className="h-6 w-6 text-gray-400" />
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Add Task</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TaskKanban;
