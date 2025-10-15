import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XCircleIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';

const UIAlerts: React.FC = () => {
    const [alerts, setAlerts] = useState([
        { id: 1, type: 'success', message: 'Your changes have been saved successfully!', dismissible: true },
        { id: 2, type: 'error', message: 'There was an error processing your request.', dismissible: true },
        { id: 3, type: 'warning', message: 'Please review your information before submitting.', dismissible: true },
        { id: 4, type: 'info', message: 'This is an informational message for your reference.', dismissible: true },
    ]);

    const dismissAlert = (id: number) => {
        setAlerts(alerts.filter(alert => alert.id !== id));
    };

    const getAlertIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircleIcon className="h-5 w-5" />;
            case 'error':
                return <XCircleIcon className="h-5 w-5" />;
            case 'warning':
                return <ExclamationTriangleIcon className="h-5 w-5" />;
            case 'info':
                return <InformationCircleIcon className="h-5 w-5" />;
            default:
                return <InformationCircleIcon className="h-5 w-5" />;
        }
    };

    const getAlertStyles = (type: string) => {
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

    const getIconStyles = (type: string) => {
        switch (type) {
            case 'success':
                return 'text-green-400';
            case 'error':
                return 'text-red-400';
            case 'warning':
                return 'text-yellow-400';
            case 'info':
                return 'text-blue-400';
            default:
                return 'text-gray-400';
        }
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Alerts</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Display contextual feedback messages for user actions</p>
            </div>

            <div className="space-y-6">
                {/* Basic Alerts */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Basic Alerts</h3>
                    <div className="space-y-4">
                        <div className={`rounded-lg border p-4 ${getAlertStyles('success')}`}>
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <div className={getIconStyles('success')}>
                                        {getAlertIcon('success')}
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium">Success!</h3>
                                    <div className="mt-2 text-sm">
                                        <p>Your changes have been saved successfully!</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`rounded-lg border p-4 ${getAlertStyles('error')}`}>
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <div className={getIconStyles('error')}>
                                        {getAlertIcon('error')}
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium">Error!</h3>
                                    <div className="mt-2 text-sm">
                                        <p>There was an error processing your request.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`rounded-lg border p-4 ${getAlertStyles('warning')}`}>
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <div className={getIconStyles('warning')}>
                                        {getAlertIcon('warning')}
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium">Warning!</h3>
                                    <div className="mt-2 text-sm">
                                        <p>Please review your information before submitting.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`rounded-lg border p-4 ${getAlertStyles('info')}`}>
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <div className={getIconStyles('info')}>
                                        {getAlertIcon('info')}
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium">Information</h3>
                                    <div className="mt-2 text-sm">
                                        <p>This is an informational message for your reference.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dismissible Alerts */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Dismissible Alerts</h3>
                    <div className="space-y-4">
                        {alerts.map((alert) => (
                            <div key={alert.id} className={`rounded-lg border p-4 ${getAlertStyles(alert.type)}`}>
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <div className={getIconStyles(alert.type)}>
                                            {getAlertIcon(alert.type)}
                                        </div>
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <h3 className="text-sm font-medium capitalize">{alert.type}!</h3>
                                        <div className="mt-2 text-sm">
                                            <p>{alert.message}</p>
                                        </div>
                                    </div>
                                    {alert.dismissible && (
                                        <div className="ml-auto pl-3">
                                            <div className="-mx-1.5 -my-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => dismissAlert(alert.id)}
                                                    className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${alert.type === 'success' ? 'focus:ring-green-600 focus:ring-offset-green-50' :
                                                            alert.type === 'error' ? 'focus:ring-red-600 focus:ring-offset-red-50' :
                                                                alert.type === 'warning' ? 'focus:ring-yellow-600 focus:ring-offset-yellow-50' :
                                                                    'focus:ring-blue-600 focus:ring-offset-blue-50'
                                                        }`}
                                                >
                                                    <span className="sr-only">Dismiss</span>
                                                    <XMarkIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Alert with Actions */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Alerts with Actions</h3>
                    <div className="space-y-4">
                        <div className={`rounded-lg border p-4 ${getAlertStyles('info')}`}>
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <div className={getIconStyles('info')}>
                                        {getAlertIcon('info')}
                                    </div>
                                </div>
                                <div className="ml-3 flex-1">
                                    <h3 className="text-sm font-medium">New feature available!</h3>
                                    <div className="mt-2 text-sm">
                                        <p>Check out our new dashboard analytics feature.</p>
                                    </div>
                                    <div className="mt-4">
                                        <div className="-mx-2 -my-1.5 flex">
                                            <button
                                                type="button"
                                                className="rounded-md bg-blue-50 px-2 py-1.5 text-sm font-medium text-blue-800 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                                            >
                                                View details
                                            </button>
                                            <button
                                                type="button"
                                                className="ml-3 rounded-md bg-blue-50 px-2 py-1.5 text-sm font-medium text-blue-800 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                                            >
                                                Dismiss
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`rounded-lg border p-4 ${getAlertStyles('warning')}`}>
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <div className={getIconStyles('warning')}>
                                        {getAlertIcon('warning')}
                                    </div>
                                </div>
                                <div className="ml-3 flex-1">
                                    <h3 className="text-sm font-medium">Account verification required</h3>
                                    <div className="mt-2 text-sm">
                                        <p>Please verify your email address to continue using all features.</p>
                                    </div>
                                    <div className="mt-4">
                                        <div className="-mx-2 -my-1.5 flex">
                                            <button
                                                type="button"
                                                className="rounded-md bg-yellow-50 px-2 py-1.5 text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/30"
                                            >
                                                Resend email
                                            </button>
                                            <button
                                                type="button"
                                                className="ml-3 rounded-md bg-yellow-50 px-2 py-1.5 text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/30"
                                            >
                                                Update email
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alert Variants */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Alert Variants</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className={`rounded-lg border p-4 ${getAlertStyles('success')}`}>
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <div className={getIconStyles('success')}>
                                        {getAlertIcon('success')}
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium">Compact Alert</h3>
                                    <div className="mt-1 text-sm">
                                        <p>This is a more compact alert message.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`rounded-lg border p-6 ${getAlertStyles('info')}`}>
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <div className={getIconStyles('info')}>
                                        {getAlertIcon('info')}
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-lg font-medium">Large Alert</h3>
                                    <div className="mt-2 text-base">
                                        <p>This is a larger alert with more padding and bigger text.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alert Usage Examples */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Usage Examples</h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Success Alert</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Use for successful operations like saving data, completing forms, or successful API calls.
                            </p>
                            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                                <code className="text-sm text-gray-800 dark:text-gray-200">
                                    {`<div className="bg-green-50 border-green-200 text-green-800 rounded-lg border p-4">`}
                                </code>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Error Alert</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Use for errors, validation failures, or failed operations.
                            </p>
                            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                                <code className="text-sm text-gray-800 dark:text-gray-200">
                                    {`<div className="bg-red-50 border-red-200 text-red-800 rounded-lg border p-4">`}
                                </code>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Warning Alert</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Use for warnings, important notices, or attention-required messages.
                            </p>
                            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                                <code className="text-sm text-gray-800 dark:text-gray-200">
                                    {`<div className="bg-yellow-50 border-yellow-200 text-yellow-800 rounded-lg border p-4">`}
                                </code>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Info Alert</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Use for informational messages, tips, or general notifications.
                            </p>
                            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                                <code className="text-sm text-gray-800 dark:text-gray-200">
                                    {`<div className="bg-blue-50 border-blue-200 text-blue-800 rounded-lg border p-4">`}
                                </code>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UIAlerts;
