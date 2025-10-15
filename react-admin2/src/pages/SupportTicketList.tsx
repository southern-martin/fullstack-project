import {
    ChatBubbleLeftRightIcon,
    CheckCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    EyeIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    PaperClipIcon,
    PencilIcon,
    TrashIcon,
    UserIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';

interface Ticket {
    id: string;
    title: string;
    description: string;
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: string;
    assignee: string;
    requester: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
    replies: number;
    attachments: number;
}

const SupportTicketList: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

    const mockTickets: Ticket[] = [
        {
            id: 'TKT-001',
            title: 'Login issues with new password',
            description: 'User cannot log in after password reset. Getting "invalid credentials" error.',
            status: 'open',
            priority: 'high',
            category: 'Authentication',
            assignee: 'Sarah Johnson',
            requester: 'john.doe@example.com',
            createdAt: '2024-01-15 10:30:00',
            updatedAt: '2024-01-15 10:30:00',
            tags: ['login', 'password', 'authentication'],
            replies: 3,
            attachments: 1,
        },
        {
            id: 'TKT-002',
            title: 'Billing discrepancy in monthly invoice',
            description: 'Monthly invoice shows incorrect amount. Expected $99, charged $149.',
            status: 'in-progress',
            priority: 'medium',
            category: 'Billing',
            assignee: 'Mike Chen',
            requester: 'jane.smith@example.com',
            createdAt: '2024-01-14 15:45:00',
            updatedAt: '2024-01-15 09:20:00',
            tags: ['billing', 'invoice', 'payment'],
            replies: 5,
            attachments: 2,
        },
        {
            id: 'TKT-003',
            title: 'Feature request: Dark mode toggle',
            description: 'Would like to add a dark mode toggle to the dashboard interface.',
            status: 'resolved',
            priority: 'low',
            category: 'Feature Request',
            assignee: 'Emily Davis',
            requester: 'user@example.com',
            createdAt: '2024-01-13 09:20:00',
            updatedAt: '2024-01-15 08:45:00',
            tags: ['feature', 'ui', 'dark-mode'],
            replies: 2,
            attachments: 0,
        },
        {
            id: 'TKT-004',
            title: 'API rate limiting too restrictive',
            description: 'API calls are being rate limited too aggressively. Need higher limits for production use.',
            status: 'open',
            priority: 'urgent',
            category: 'API',
            assignee: 'David Wilson',
            requester: 'dev@company.com',
            createdAt: '2024-01-15 11:15:00',
            updatedAt: '2024-01-15 11:15:00',
            tags: ['api', 'rate-limit', 'production'],
            replies: 1,
            attachments: 3,
        },
        {
            id: 'TKT-005',
            title: 'Mobile app crashes on iOS 17',
            description: 'App crashes immediately after launch on iOS 17 devices.',
            status: 'in-progress',
            priority: 'high',
            category: 'Mobile App',
            assignee: 'Sarah Johnson',
            requester: 'mobile.user@example.com',
            createdAt: '2024-01-14 16:30:00',
            updatedAt: '2024-01-15 10:15:00',
            tags: ['mobile', 'ios', 'crash'],
            replies: 4,
            attachments: 1,
        },
        {
            id: 'TKT-006',
            title: 'Data export functionality not working',
            description: 'Cannot export user data in CSV format. Error message appears.',
            status: 'closed',
            priority: 'medium',
            category: 'Data Export',
            assignee: 'Mike Chen',
            requester: 'admin@company.com',
            createdAt: '2024-01-12 14:20:00',
            updatedAt: '2024-01-14 16:45:00',
            tags: ['export', 'csv', 'data'],
            replies: 6,
            attachments: 0,
        },
    ];

    const filteredTickets = mockTickets.filter(ticket => {
        const matchesSearch =
            ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.requester.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
        const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });

    const getStatusBadge = (status: string) => {
        const statusClasses = {
            open: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
            'in-progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
            resolved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
            closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
        };

        const statusIcons = {
            open: <ClockIcon className="h-3 w-3" />,
            'in-progress': <ExclamationTriangleIcon className="h-3 w-3" />,
            resolved: <CheckCircleIcon className="h-3 w-3" />,
            closed: <XCircleIcon className="h-3 w-3" />,
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
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getTicketStats = () => {
        const total = mockTickets.length;
        const open = mockTickets.filter(t => t.status === 'open').length;
        const inProgress = mockTickets.filter(t => t.status === 'in-progress').length;
        const resolved = mockTickets.filter(t => t.status === 'resolved').length;
        const closed = mockTickets.filter(t => t.status === 'closed').length;

        return { total, open, inProgress, resolved, closed };
    };

    const stats = getTicketStats();

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Ticket List</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive view of all support tickets</p>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                        {viewMode === 'list' ? 'Grid View' : 'List View'}
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                                <UserIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
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
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                                <ClockIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Open</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.open}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                                <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
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
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Resolved</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.resolved}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900/20">
                                <XCircleIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            </div>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Closed</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.closed}</p>
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
                                placeholder="Search tickets..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            />
                        </div>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${showFilters || statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all'
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
                            {filteredTickets.length} tickets
                        </span>
                    </div>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="open">Open</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="closed">Closed</option>
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

                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Category</label>
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="all">All Categories</option>
                                    <option value="Authentication">Authentication</option>
                                    <option value="Billing">Billing</option>
                                    <option value="Feature Request">Feature Request</option>
                                    <option value="API">API</option>
                                    <option value="Mobile App">Mobile App</option>
                                    <option value="Data Export">Data Export</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Tickets Display */}
            {viewMode === 'list' ? (
                /* List View */
                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Ticket
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
                                        Replies
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Created
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                                {filteredTickets.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {ticket.id}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {ticket.title}
                                                </div>
                                                <div className="text-xs text-gray-400 dark:text-gray-500">
                                                    {ticket.category}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            {getStatusBadge(ticket.status)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            {getPriorityBadge(ticket.priority)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                                            {ticket.assignee}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center space-x-1">
                                                <ChatBubbleLeftRightIcon className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm text-gray-600 dark:text-gray-400">{ticket.replies}</span>
                                                {ticket.attachments > 0 && (
                                                    <>
                                                        <PaperClipIcon className="h-4 w-4 text-gray-400 ml-2" />
                                                        <span className="text-sm text-gray-600 dark:text-gray-400">{ticket.attachments}</span>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {formatDate(ticket.createdAt)}
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
            ) : (
                /* Grid View */
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredTickets.map((ticket) => (
                        <div key={ticket.id} className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                            {ticket.id}
                                        </h3>
                                        {getStatusBadge(ticket.status)}
                                    </div>
                                    <h4 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                                        {ticket.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                        {ticket.description}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                        <span>{ticket.category}</span>
                                        <span>{formatDate(ticket.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-1">
                                        <ChatBubbleLeftRightIcon className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{ticket.replies}</span>
                                    </div>
                                    {ticket.attachments > 0 && (
                                        <div className="flex items-center space-x-1">
                                            <PaperClipIcon className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-600 dark:text-gray-400">{ticket.attachments}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                                        <EyeIcon className="h-4 w-4" />
                                    </button>
                                    <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                        <PencilIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SupportTicketList;
