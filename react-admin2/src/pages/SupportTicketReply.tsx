import {
    ArrowLeftIcon,
    CheckCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    PaperAirplaneIcon,
    PaperClipIcon,
    UserIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'agent';
    timestamp: string;
    type: 'text' | 'image' | 'file';
    agentName?: string;
    agentAvatar?: string;
    attachments?: string[];
}

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
}

const SupportTicketReply: React.FC = () => {
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const mockTicket: Ticket = {
        id: 'TKT-001',
        title: 'Login issues with new password',
        description: 'User cannot log in after password reset. Getting "invalid credentials" error.',
        status: 'in-progress',
        priority: 'high',
        category: 'Authentication',
        assignee: 'Sarah Johnson',
        requester: 'john.doe@example.com',
        createdAt: '2024-01-15 10:30:00',
        updatedAt: '2024-01-15 10:30:00',
        tags: ['login', 'password', 'authentication'],
    };

    const mockMessages: Message[] = [
        {
            id: '1',
            text: 'Hello! I\'m having trouble logging in after resetting my password. I keep getting an "invalid credentials" error.',
            sender: 'user',
            timestamp: '2024-01-15 10:30:00',
            type: 'text',
        },
        {
            id: '2',
            text: 'Hello! Thank you for contacting support. I understand you\'re having trouble logging in after a password reset. Let me help you with this issue.',
            sender: 'agent',
            timestamp: '2024-01-15 10:32:00',
            type: 'text',
            agentName: 'Sarah Johnson',
        },
        {
            id: '3',
            text: 'To help resolve this issue, could you please try the following steps:\n\n1. Clear your browser cache and cookies\n2. Try logging in using an incognito/private window\n3. Make sure you\'re using the correct email address\n\nIf these steps don\'t work, please let me know and I\'ll escalate this to our technical team.',
            sender: 'agent',
            timestamp: '2024-01-15 10:35:00',
            type: 'text',
            agentName: 'Sarah Johnson',
        },
        {
            id: '4',
            text: 'I tried all those steps but I\'m still getting the same error. I\'m definitely using the correct email address.',
            sender: 'user',
            timestamp: '2024-01-15 10:45:00',
            type: 'text',
        },
        {
            id: '5',
            text: 'I understand. Let me check your account status and reset your password again from our end. This should resolve the issue.',
            sender: 'agent',
            timestamp: '2024-01-15 10:47:00',
            type: 'text',
            agentName: 'Sarah Johnson',
        },
    ];

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

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;

        // Simulate sending message
        setIsTyping(true);

        // Here you would typically send the message to your backend
        console.log('Sending message:', newMessage);
        console.log('Attachments:', selectedFiles);

        // Clear the form
        setNewMessage('');
        setSelectedFiles([]);

        // Simulate agent response
        setTimeout(() => {
            setIsTyping(false);
            // In a real app, you would update the messages state with the new message
        }, 1000);
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setSelectedFiles(prev => [...prev, ...files]);
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                        <ArrowLeftIcon className="h-5 w-5" />
                        <span className="text-sm">Back to Tickets</span>
                    </button>
                </div>
                <div className="flex items-center space-x-2">
                    {getStatusBadge(mockTicket.status)}
                    {getPriorityBadge(mockTicket.priority)}
                </div>
            </div>

            {/* Ticket Info */}
            <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {mockTicket.id}: {mockTicket.title}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {mockTicket.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                            <span>Category: {mockTicket.category}</span>
                            <span>Assignee: {mockTicket.assignee}</span>
                            <span>Created: {formatDate(mockTicket.createdAt)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex h-[calc(100vh-20rem)] rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                {/* Messages Area */}
                <div className="flex flex-1 flex-col">
                    {/* Messages Header */}
                    <div className="border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600">
                                    <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                        {mockTicket.assignee}
                                    </h3>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        Support Agent
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {mockMessages.length} messages
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-4">
                            {mockMessages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs rounded-lg px-4 py-2 ${message.sender === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                                            }`}
                                    >
                                        {message.sender === 'agent' && message.agentName && (
                                            <div className="mb-1 text-xs font-medium opacity-75">
                                                {message.agentName}
                                            </div>
                                        )}
                                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                                        <div className="mt-1 text-xs opacity-75">
                                            {formatTime(message.timestamp)}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="max-w-xs rounded-lg bg-gray-100 px-4 py-2 text-gray-900 dark:bg-gray-700 dark:text-white">
                                        <div className="flex items-center space-x-1">
                                            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                                            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-150"></div>
                                            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-300"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Message Input */}
                    <div className="border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                        {/* File Attachments */}
                        {selectedFiles.length > 0 && (
                            <div className="mb-3">
                                <div className="flex flex-wrap gap-2">
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className="flex items-center space-x-2 rounded-lg bg-gray-100 px-3 py-2 text-sm dark:bg-gray-700">
                                            <span className="text-gray-600 dark:text-gray-400">{file.name}</span>
                                            <button
                                                onClick={() => removeFile(index)}
                                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center space-x-3">
                            <input
                                type="file"
                                id="file-upload"
                                multiple
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                            >
                                <PaperClipIcon className="h-5 w-5" />
                            </label>

                            <div className="flex-1">
                                <textarea
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your reply..."
                                    rows={3}
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white resize-none"
                                />
                            </div>

                            <button
                                onClick={handleSendMessage}
                                disabled={newMessage.trim() === ''}
                                className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <PaperAirplaneIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Ticket Details Sidebar */}
                <div className="w-80 border-l border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Ticket Details</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Status
                            </label>
                            <select className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                                <option value="open">Open</option>
                                <option value="in-progress" selected>In Progress</option>
                                <option value="resolved">Resolved</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Priority
                            </label>
                            <select className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high" selected>High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Assignee
                            </label>
                            <select className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                                <option value="sarah" selected>Sarah Johnson</option>
                                <option value="mike">Mike Chen</option>
                                <option value="emily">Emily Davis</option>
                                <option value="david">David Wilson</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Tags
                            </label>
                            <div className="flex flex-wrap gap-1">
                                {mockTicket.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Requester
                            </label>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {mockTicket.requester}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Created
                            </label>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {formatDate(mockTicket.createdAt)}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Last Updated
                            </label>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {formatDate(mockTicket.updatedAt)}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 space-y-2">
                        <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                            Update Ticket
                        </button>
                        <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                            Add Internal Note
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportTicketReply;
