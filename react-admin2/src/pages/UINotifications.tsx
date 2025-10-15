import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';

interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: string;
}

const UINotifications: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            type: 'success',
            title: 'Success!',
            message: 'Your changes have been saved successfully.',
            timestamp: '2 minutes ago'
        },
        {
            id: '2',
            type: 'error',
            title: 'Error',
            message: 'Failed to save changes. Please try again.',
            timestamp: '5 minutes ago'
        },
        {
            id: '3',
            type: 'warning',
            title: 'Warning',
            message: 'Your session will expire in 10 minutes.',
            timestamp: '10 minutes ago'
        },
        {
            id: '4',
            type: 'info',
            title: 'Information',
            message: 'New features are now available in your dashboard.',
            timestamp: '1 hour ago'
        }
    ]);

    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('success');

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
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

    const getNotificationStyles = (type: string) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400';
            case 'error':
                return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400';
            case 'info':
                return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-400';
        }
    };

    const removeNotification = (id: string) => {
        setNotifications(notifications.filter(notification => notification.id !== id));
    };

    const showToastNotification = (type: 'success' | 'error' | 'warning' | 'info') => {
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
    };

    const addNotification = (type: 'success' | 'error' | 'warning' | 'info') => {
        const newNotification: Notification = {
            id: Date.now().toString(),
            type,
            title: type.charAt(0).toUpperCase() + type.slice(1),
            message: `This is a ${type} notification message.`,
            timestamp: 'Just now'
        };
        setNotifications([newNotification, ...notifications]);
    };

    return (
        <div className="mx-auto max-w-7xl p-6">
            <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>

            {/* Toast Notifications */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Toast Notifications</h2>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => showToastNotification('success')}
                        className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                    >
                        Success Toast
                    </button>
                    <button
                        onClick={() => showToastNotification('error')}
                        className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                        Error Toast
                    </button>
                    <button
                        onClick={() => showToastNotification('warning')}
                        className="rounded-lg bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
                    >
                        Warning Toast
                    </button>
                    <button
                        onClick={() => showToastNotification('info')}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        Info Toast
                    </button>
                </div>

                {/* Toast Container */}
                {showToast && (
                    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right">
                        <div className={`rounded-lg border p-4 shadow-lg ${getNotificationStyles(toastType)}`}>
                            <div className="flex items-center">
                                {getNotificationIcon(toastType)}
                                <div className="ml-3">
                                    <p className="font-medium">{toastType.charAt(0).toUpperCase() + toastType.slice(1)}</p>
                                    <p className="text-sm opacity-90">This is a {toastType} toast notification.</p>
                                </div>
                                <button
                                    onClick={() => setShowToast(false)}
                                    className="ml-4 text-current opacity-70 hover:opacity-100"
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Alert Notifications */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Alert Notifications</h2>
                <div className="space-y-4">
                    <div className={`rounded-lg border p-4 ${getNotificationStyles('success')}`}>
                        <div className="flex items-center">
                            {getNotificationIcon('success')}
                            <div className="ml-3">
                                <h3 className="font-medium">Success!</h3>
                                <p className="text-sm opacity-90">Your operation completed successfully.</p>
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-lg border p-4 ${getNotificationStyles('error')}`}>
                        <div className="flex items-center">
                            {getNotificationIcon('error')}
                            <div className="ml-3">
                                <h3 className="font-medium">Error</h3>
                                <p className="text-sm opacity-90">Something went wrong. Please try again.</p>
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-lg border p-4 ${getNotificationStyles('warning')}`}>
                        <div className="flex items-center">
                            {getNotificationIcon('warning')}
                            <div className="ml-3">
                                <h3 className="font-medium">Warning</h3>
                                <p className="text-sm opacity-90">Please review your input before proceeding.</p>
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-lg border p-4 ${getNotificationStyles('info')}`}>
                        <div className="flex items-center">
                            {getNotificationIcon('info')}
                            <div className="ml-3">
                                <h3 className="font-medium">Information</h3>
                                <p className="text-sm opacity-90">Here's some helpful information for you.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification Center */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notification Center</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => addNotification('success')}
                            className="rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
                        >
                            Add Success
                        </button>
                        <button
                            onClick={() => addNotification('error')}
                            className="rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
                        >
                            Add Error
                        </button>
                        <button
                            onClick={() => addNotification('warning')}
                            className="rounded-lg bg-yellow-600 px-3 py-1.5 text-sm text-white hover:bg-yellow-700"
                        >
                            Add Warning
                        </button>
                        <button
                            onClick={() => addNotification('info')}
                            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
                        >
                            Add Info
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`rounded-lg border p-4 ${getNotificationStyles(notification.type)}`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start">
                                    {getNotificationIcon(notification.type)}
                                    <div className="ml-3">
                                        <h3 className="font-medium">{notification.title}</h3>
                                        <p className="text-sm opacity-90">{notification.message}</p>
                                        <p className="mt-1 text-xs opacity-75">{notification.timestamp}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeNotification(notification.id)}
                                    className="ml-4 text-current opacity-70 hover:opacity-100"
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {notifications.length === 0 && (
                    <div className="text-center py-8">
                        <InformationCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No notifications</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            You're all caught up! No new notifications.
                        </p>
                    </div>
                )}
            </div>

            {/* Inline Notifications */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Inline Notifications</h2>
                <div className="space-y-4">
                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center">
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                Form submitted successfully
                            </span>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center">
                            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                Please fill in all required fields
                            </span>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center">
                            <InformationCircleIcon className="h-5 w-5 text-blue-500" />
                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                New updates are available
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UINotifications;
