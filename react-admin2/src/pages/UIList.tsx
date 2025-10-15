import React from 'react';
import { CheckIcon, XMarkIcon, ExclamationTriangleIcon, InformationCircleIcon, UserIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline';

const UIList: React.FC = () => {
    const todoItems = [
        { id: 1, text: 'Complete project documentation', completed: true },
        { id: 2, text: 'Review code changes', completed: false },
        { id: 3, text: 'Update user interface', completed: false },
        { id: 4, text: 'Test new features', completed: true },
    ];

    const notificationItems = [
        { id: 1, type: 'success', message: 'Your account has been updated successfully', time: '2 minutes ago' },
        { id: 2, type: 'error', message: 'Failed to save changes. Please try again.', time: '5 minutes ago' },
        { id: 3, type: 'warning', message: 'Your subscription will expire in 3 days', time: '1 hour ago' },
        { id: 4, type: 'info', message: 'New features are now available', time: '2 hours ago' },
    ];

    const userItems = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Editor', status: 'inactive' },
        { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'User', status: 'active' },
    ];

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckIcon className="h-5 w-5 text-green-500" />;
            case 'error':
                return <XMarkIcon className="h-5 w-5 text-red-500" />;
            case 'warning':
                return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
            case 'info':
                return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
            default:
                return <InformationCircleIcon className="h-5 w-5 text-gray-500" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const statusClasses = {
            active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
            inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
        };
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status as keyof typeof statusClasses]}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">List Components</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Various list styles and layouts</p>
            </div>

            <div className="space-y-8">
                {/* Basic Lists */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Basic Lists</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Unordered List</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                        <span className="text-gray-700 dark:text-gray-300">First item</span>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                        <span className="text-gray-700 dark:text-gray-300">Second item</span>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                        <span className="text-gray-700 dark:text-gray-300">Third item</span>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Ordered List</h4>
                                <ol className="space-y-2 list-decimal list-inside">
                                    <li className="text-gray-700 dark:text-gray-300">First step</li>
                                    <li className="text-gray-700 dark:text-gray-300">Second step</li>
                                    <li className="text-gray-700 dark:text-gray-300">Third step</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Todo List */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Todo List</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <h4 className="font-semibold text-gray-900 dark:text-white">Tasks</h4>
                            </div>
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {todoItems.map((item) => (
                                    <div key={item.id} className="p-4 flex items-center">
                                        <div className="flex-shrink-0 mr-3">
                                            {item.completed ? (
                                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                    <CheckIcon className="h-3 w-3 text-white" />
                                                </div>
                                            ) : (
                                                <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-full"></div>
                                            )}
                                        </div>
                                        <span className={`flex-1 ${item.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                                            {item.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notification List */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Notification List</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <h4 className="font-semibold text-gray-900 dark:text-white">Notifications</h4>
                            </div>
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {notificationItems.map((item) => (
                                    <div key={item.id} className="p-4 flex items-start">
                                        <div className="flex-shrink-0 mr-3 mt-0.5">
                                            {getNotificationIcon(item.type)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-900 dark:text-white">{item.message}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* User List */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">User List</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <h4 className="font-semibold text-gray-900 dark:text-white">Team Members</h4>
                            </div>
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {userItems.map((user) => (
                                    <div key={user.id} className="p-4 flex items-center">
                                        <div className="flex-shrink-0 mr-4">
                                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                                <UserIcon className="h-5 w-5 text-white" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">{user.role}</span>
                                                    {getStatusBadge(user.status)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Icon List */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Icon List</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                        <UserIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">User Management</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage user accounts and permissions</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                        <CalendarIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Calendar Events</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Schedule and manage events</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                                        <TagIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Tags & Categories</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Organize content with tags</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Numbered List */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Numbered List</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="space-y-4">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                    1
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Setup your account</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Create your account and verify your email address</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                    2
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Configure settings</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Set up your preferences and notification settings</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                    3
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Start using the platform</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Begin exploring features and creating content</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Interactive List */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Interactive List</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <h4 className="font-semibold text-gray-900 dark:text-white">Recent Files</h4>
                            </div>
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {['document.pdf', 'presentation.pptx', 'spreadsheet.xlsx', 'image.jpg'].map((file, index) => (
                                    <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                    {file.split('.').pop()?.toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{file}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Modified 2 hours ago</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UIList;
