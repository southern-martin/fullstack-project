import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    MagnifyingGlassIcon, 
    FunnelIcon, 
    StarIcon, 
    ArchiveBoxIcon, 
    TrashIcon, 
    EnvelopeIcon, 
    EnvelopeOpenIcon,
    ClockIcon,
    UserIcon,
    TagIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const SupportInbox: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [selectedTickets, setSelectedTickets] = useState<Set<string>>(new Set());
    const [sortBy, setSortBy] = useState('date');

    const tickets = [
        {
            id: '1',
            subject: 'Login issues with new account',
            customer: 'John Doe',
            email: 'john@example.com',
            status: 'open',
            priority: 'high',
            category: 'technical',
            assignedTo: 'Sarah Wilson',
            lastActivity: '2 hours ago',
            createdAt: '2024-01-15',
            isStarred: true,
            isRead: false,
            message: 'I am unable to log in to my account after creating it yesterday. I keep getting an error message...'
        },
        {
            id: '2',
            subject: 'Billing question about subscription',
            customer: 'Jane Smith',
            email: 'jane@example.com',
            status: 'pending',
            priority: 'medium',
            category: 'billing',
            assignedTo: 'Mike Johnson',
            lastActivity: '4 hours ago',
            createdAt: '2024-01-15',
            isStarred: false,
            isRead: true,
            message: 'I have a question about my monthly subscription. Can you help me understand the charges?'
        },
        {
            id: '3',
            subject: 'Feature request: Dark mode',
            customer: 'Bob Wilson',
            email: 'bob@example.com',
            status: 'closed',
            priority: 'low',
            category: 'feature',
            assignedTo: 'Sarah Wilson',
            lastActivity: '1 day ago',
            createdAt: '2024-01-14',
            isStarred: false,
            isRead: true,
            message: 'Would it be possible to add a dark mode option to the application?'
        },
        {
            id: '4',
            subject: 'Bug report: Dashboard not loading',
            customer: 'Alice Brown',
            email: 'alice@example.com',
            status: 'open',
            priority: 'critical',
            category: 'bug',
            assignedTo: 'Mike Johnson',
            lastActivity: '30 minutes ago',
            createdAt: '2024-01-15',
            isStarred: true,
            isRead: false,
            message: 'The dashboard is not loading properly. I see a blank screen with an error message.'
        },
        {
            id: '5',
            subject: 'Account deletion request',
            customer: 'Charlie Davis',
            email: 'charlie@example.com',
            status: 'pending',
            priority: 'medium',
            category: 'account',
            assignedTo: 'Sarah Wilson',
            lastActivity: '6 hours ago',
            createdAt: '2024-01-15',
            isStarred: false,
            isRead: true,
            message: 'I would like to delete my account and all associated data.'
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'closed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
            case 'high':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'low':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            ticket.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = selectedFilter === 'all' || 
                            ticket.status === selectedFilter ||
                            ticket.priority === selectedFilter ||
                            ticket.category === selectedFilter;
        
        return matchesSearch && matchesFilter;
    });

    const toggleTicketSelection = (ticketId: string) => {
        setSelectedTickets(prev => {
            const newSet = new Set(prev);
            if (newSet.has(ticketId)) {
                newSet.delete(ticketId);
            } else {
                newSet.add(ticketId);
            }
            return newSet;
        });
    };

    const selectAllTickets = () => {
        if (selectedTickets.size === filteredTickets.length) {
            setSelectedTickets(new Set());
        } else {
            setSelectedTickets(new Set(filteredTickets.map(ticket => ticket.id)));
        }
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Support Inbox</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage customer support tickets</p>
            </div>

            {/* Header Actions */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                    <select
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">All Tickets</option>
                        <option value="open">Open</option>
                        <option value="pending">Pending</option>
                        <option value="closed">Closed</option>
                        <option value="critical">Critical</option>
                        <option value="high">High Priority</option>
                        <option value="technical">Technical</option>
                        <option value="billing">Billing</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="date">Sort by Date</option>
                        <option value="priority">Sort by Priority</option>
                        <option value="status">Sort by Status</option>
                        <option value="customer">Sort by Customer</option>
                    </select>
                </div>
            </div>

            {/* Bulk Actions */}
            {selectedTickets.size > 0 && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-between">
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                        {selectedTickets.size} ticket(s) selected
                    </span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                            Mark as Read
                        </button>
                        <button className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                            Close
                        </button>
                        <button className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors">
                            Archive
                        </button>
                        <button className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                            Delete
                        </button>
                    </div>
                </div>
            )}

            {/* Tickets List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Table Header */}
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={selectedTickets.size === filteredTickets.length && filteredTickets.length > 0}
                            onChange={selectAllTickets}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                        />
                        <div className="ml-4 flex-1 grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            <div className="col-span-4">Subject</div>
                            <div className="col-span-2">Customer</div>
                            <div className="col-span-1">Status</div>
                            <div className="col-span-1">Priority</div>
                            <div className="col-span-2">Assigned To</div>
                            <div className="col-span-1">Last Activity</div>
                            <div className="col-span-1">Actions</div>
                        </div>
                    </div>
                </div>

                {/* Tickets */}
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredTickets.map((ticket) => (
                        <div key={ticket.id} className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${!ticket.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedTickets.has(ticket.id)}
                                    onChange={() => toggleTicketSelection(ticket.id)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                                />
                                <div className="ml-4 flex-1 grid grid-cols-12 gap-4 items-center">
                                    {/* Subject */}
                                    <div className="col-span-4">
                                        <div className="flex items-center space-x-2">
                                            {!ticket.isRead && (
                                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                            )}
                                            <Link
                                                to={`/support/tickets/${ticket.id}`}
                                                className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                                            >
                                                {ticket.subject}
                                            </Link>
                                            <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                                                {ticket.isStarred ? (
                                                    <StarSolidIcon className="h-4 w-4 text-yellow-500" />
                                                ) : (
                                                    <StarIcon className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                                            {ticket.message}
                                        </p>
                                    </div>

                                    {/* Customer */}
                                    <div className="col-span-2">
                                        <div className="flex items-center space-x-2">
                                            <UserIcon className="h-4 w-4 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{ticket.customer}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{ticket.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="col-span-1">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                            {ticket.status}
                                        </span>
                                    </div>

                                    {/* Priority */}
                                    <div className="col-span-1">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                            {ticket.priority}
                                        </span>
                                    </div>

                                    {/* Assigned To */}
                                    <div className="col-span-2">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                                    {ticket.assignedTo.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            </div>
                                            <span className="text-sm text-gray-900 dark:text-white">{ticket.assignedTo}</span>
                                        </div>
                                    </div>

                                    {/* Last Activity */}
                                    <div className="col-span-1">
                                        <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                                            <ClockIcon className="h-3 w-3" />
                                            <span>{ticket.lastActivity}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="col-span-1">
                                        <div className="flex items-center space-x-1">
                                            <button className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                                <EnvelopeOpenIcon className="h-4 w-4" />
                                            </button>
                                            <button className="p-1 text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">
                                                <ArchiveBoxIcon className="h-4 w-4" />
                                            </button>
                                            <button className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                    Showing {filteredTickets.length} of {tickets.length} tickets
                </div>
                <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        Previous
                    </button>
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">1</button>
                    <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        2
                    </button>
                    <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SupportInbox;
