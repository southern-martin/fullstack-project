import {
    CheckCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    EyeIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    PlusIcon,
    TagIcon,
    TrashIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';

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

const TaskList: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    const mockTasks: Task[] = [
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
    ];

    const filteredTasks = mockTasks.filter(task => {
        const matchesSearch =
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.assignee.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    const getStatusBadge = (status: string) => {
        const statusClasses = {
            todo: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
            'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
            completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
            cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
        };

        const statusIcons = {
            todo: <ClockIcon className="h-3 w-3" />,
            'in-progress': <ExclamationTriangleIcon className="h-3 w-3" />,
            completed: <CheckCircleIcon className="h-3 w-3" />,
            cancelled: <XCircleIcon className="h-3 w-3" />,
        };

        return (
            <span className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClasses[status as keyof typeof statusClasses]}`}>
                {statusIcons[status as keyof typeof statusIcons]}
                <span>{status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}</span>
            </span>
        );
    };

    const getPriorityBadge = (priority: string) => {
        const priorityClasses = {
            low: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
            medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
            high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
            urgent: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
        };

        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityClasses[priority as keyof typeof priorityClasses]}`}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getTaskStats = () => {
        const total = mockTasks.length;
        const todo = mockTasks.filter(t => t.status === 'todo').length;
        const inProgress = mockTasks.filter(t => t.status === 'in-progress').length;
        const completed = mockTasks.filter(t => t.status === 'completed').length;
        const cancelled = mockTasks.filter(t => t.status === 'cancelled').length;

        return { total, todo, inProgress, completed, cancelled };
    };

    const stats = getTaskStats();

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Task List</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage and track all your tasks</p>
                </div>

                <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        <PlusIcon className="h-4 w-4" />
                        <span>Add Task</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                <TagIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            </div>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.total}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                <ClockIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            </div>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">To Do</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.todo}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                                <ExclamationTriangleIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.inProgress}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                                <CheckCircleIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.completed}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                                <XCircleIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Cancelled</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.cancelled}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-1 items-center space-x-2">
                        <div className="relative flex-1 max-w-md">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            />
                        </div>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${showFilters || statusFilter !== 'all' || priorityFilter !== 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                }`}
                        >
                            <FunnelIcon className="h-4 w-4" />
                            <span>Filters</span>
                        </button>
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {filteredTasks.length} tasks
                        </span>
                    </div>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="todo">To Do</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Priority</label>
                                <select
                                    value={priorityFilter}
                                    onChange={(e) => setPriorityFilter(e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="all">All Priorities</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Tasks Table */}
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Task
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Priority
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Assignee
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Due Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Progress
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                            {filteredTasks.map((task) => (
                                <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {task.id}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {task.title}
                                            </div>
                                            <div className="text-xs text-gray-400 dark:text-gray-500">
                                                {task.description}
                                            </div>
                                            <div className="mt-1 flex flex-wrap gap-1">
                                                {task.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {getStatusBadge(task.status)}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {getPriorityBadge(task.priority)}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                                        {task.assignee}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {formatDate(task.dueDate)}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-16 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{ width: `${task.progress}%` }}
                                                ></div>
                                            </div>
                                            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                                {task.progress}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                                                <EyeIcon className="h-4 w-4" />
                                            </button>
                                            <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                                <PencilIcon className="h-4 w-4" />
                                            </button>
                                            <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TaskList;
