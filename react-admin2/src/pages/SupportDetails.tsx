import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
    ArrowLeftIcon,
    StarIcon,
    ArchiveBoxIcon,
    TrashIcon,
    PaperAirplaneIcon,
    PaperClipIcon,
    UserIcon,
    ClockIcon,
    TagIcon,
    ChevronDownIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const SupportDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [newMessage, setNewMessage] = useState('');
    const [isStarred, setIsStarred] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock ticket data - in real app, this would come from API
    const ticket = {
        id: id || '1',
        subject: 'Login issues with new account',
        customer: {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1 (555) 123-4567',
            company: 'Acme Corp',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        status: 'open',
        priority: 'high',
        category: 'technical',
        assignedTo: {
            name: 'Sarah Wilson',
            email: 'sarah@company.com',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        createdAt: '2024-01-15T10:30:00Z',
        lastActivity: '2024-01-15T12:45:00Z',
        isStarred: true,
        tags: ['login', 'authentication', 'new-user']
    };

    const messages = [
        {
            id: '1',
            type: 'customer',
            sender: ticket.customer,
            content: 'I am unable to log in to my account after creating it yesterday. I keep getting an error message that says "Invalid credentials" even though I\'m sure I\'m using the correct email and password. I\'ve tried resetting my password but haven\'t received any email. Can you please help me resolve this issue?',
            timestamp: '2024-01-15T10:30:00Z',
            attachments: []
        },
        {
            id: '2',
            type: 'agent',
            sender: ticket.assignedTo,
            content: 'Thank you for contacting us, John. I understand your frustration with the login issue. Let me help you resolve this.\n\nFirst, let\'s verify your account status. Can you please try the following steps:\n\n1. Check your spam/junk folder for the password reset email\n2. Try logging in with a different browser or incognito mode\n3. Clear your browser cache and cookies\n\nIf none of these steps work, I can manually reset your password for you. Please let me know the results of these steps.',
            timestamp: '2024-01-15T11:15:00Z',
            attachments: []
        },
        {
            id: '3',
            type: 'customer',
            sender: ticket.customer,
            content: 'I checked my spam folder and found the password reset email. I was able to reset my password and now I can log in successfully. Thank you for your help!',
            timestamp: '2024-01-15T12:45:00Z',
            attachments: []
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

    const formatTimestamp = (timestamp: string) => {
        return new Date(timestamp).toLocaleString();
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setIsSubmitting(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setNewMessage('');
        }, 1000);
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/support/tickets"
                            className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <ArrowLeftIcon className="h-4 w-4 mr-1" />
                            Back to Tickets
                        </Link>
                        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Ticket #{ticket.id}
                        </h2>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setIsStarred(!isStarred)}
                            className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
                        >
                            {isStarred ? (
                                <StarSolidIcon className="h-5 w-5 text-yellow-500" />
                            ) : (
                                <StarIcon className="h-5 w-5" />
                            )}
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                            <ArchiveBoxIcon className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Ticket Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    {ticket.subject}
                                </h3>
                                <div className="flex items-center space-x-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                        {ticket.status}
                                    </span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                        {ticket.priority}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {ticket.category}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex items-center space-x-2 mb-4">
                            <TagIcon className="h-4 w-4 text-gray-400" />
                            <div className="flex flex-wrap gap-2">
                                {ticket.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex space-x-3 ${message.type === 'agent' ? 'flex-row-reverse space-x-reverse' : ''}`}
                                >
                                    <div className="flex-shrink-0">
                                        <img
                                            className="h-8 w-8 rounded-full"
                                            src={message.sender.avatar}
                                            alt={message.sender.name}
                                        />
                                    </div>
                                    <div className={`flex-1 ${message.type === 'agent' ? 'text-right' : ''}`}>
                                        <div className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                            message.type === 'agent'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                                        }`}>
                                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                        </div>
                                        <div className={`mt-1 text-xs text-gray-500 dark:text-gray-400 ${message.type === 'agent' ? 'text-right' : ''}`}>
                                            {message.sender.name} • {formatTimestamp(message.timestamp)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Reply Form */}
                        <form onSubmit={handleSendMessage} className="mt-6">
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <textarea
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    rows={4}
                                    placeholder="Type your reply..."
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <div className="mt-3 flex items-center justify-between">
                                    <button
                                        type="button"
                                        className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                    >
                                        <PaperClipIcon className="h-4 w-4 mr-1" />
                                        Attach file
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !newMessage.trim()}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                                                Send Reply
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Customer</h3>
                        <div className="flex items-center space-x-3 mb-4">
                            <img
                                className="h-12 w-12 rounded-full"
                                src={ticket.customer.avatar}
                                alt={ticket.customer.name}
                            />
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                    {ticket.customer.name}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {ticket.customer.email}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                                <UserIcon className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-400">{ticket.customer.company}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <ClockIcon className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-400">
                                    Created {formatTimestamp(ticket.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Assigned Agent */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Assigned Agent</h3>
                        <div className="flex items-center space-x-3">
                            <img
                                className="h-10 w-10 rounded-full"
                                src={ticket.assignedTo.avatar}
                                alt={ticket.assignedTo.name}
                            />
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                    {ticket.assignedTo.name}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {ticket.assignedTo.email}
                                </p>
                            </div>
                        </div>
                        <button className="mt-3 w-full text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                            Reassign Ticket
                        </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                <CheckCircleIcon className="h-4 w-4 inline mr-2 text-green-500" />
                                Mark as Resolved
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                <ExclamationTriangleIcon className="h-4 w-4 inline mr-2 text-yellow-500" />
                                Escalate Priority
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                <InformationCircleIcon className="h-4 w-4 inline mr-2 text-blue-500" />
                                Add Internal Note
                            </button>
                        </div>
                    </div>

                    {/* Ticket History */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ticket History</h3>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                <div>
                                    <p className="text-sm text-gray-900 dark:text-white">Ticket created</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatTimestamp(ticket.createdAt)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                <div>
                                    <p className="text-sm text-gray-900 dark:text-white">Assigned to Sarah Wilson</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatTimestamp(ticket.createdAt)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                                <div>
                                    <p className="text-sm text-gray-900 dark:text-white">Status changed to Open</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatTimestamp(ticket.lastActivity)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportDetails;
