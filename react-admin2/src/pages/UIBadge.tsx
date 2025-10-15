import React from 'react';
import { CheckIcon, XMarkIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const UIBadge: React.FC = () => {
    const badgeVariants = [
        { name: 'Default', class: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' },
        { name: 'Primary', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
        { name: 'Success', class: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
        { name: 'Warning', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
        { name: 'Danger', class: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
        { name: 'Info', class: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400' },
        { name: 'Purple', class: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' },
        { name: 'Pink', class: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400' },
    ];

    const badgeSizes = [
        { name: 'Small', class: 'px-2 py-0.5 text-xs' },
        { name: 'Medium', class: 'px-2.5 py-0.5 text-sm' },
        { name: 'Large', class: 'px-3 py-1 text-base' },
    ];

    const badgeShapes = [
        { name: 'Rounded', class: 'rounded-full' },
        { name: 'Square', class: 'rounded' },
        { name: 'Pill', class: 'rounded-full px-3' },
    ];

    const statusBadges = [
        { name: 'Active', class: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', icon: CheckIcon },
        { name: 'Inactive', class: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400', icon: XMarkIcon },
        { name: 'Pending', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400', icon: ExclamationTriangleIcon },
        { name: 'Error', class: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', icon: XMarkIcon },
        { name: 'Info', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', icon: InformationCircleIcon },
    ];

    const notificationBadges = [
        { count: 1, class: 'bg-red-500 text-white' },
        { count: 5, class: 'bg-red-500 text-white' },
        { count: 12, class: 'bg-red-500 text-white' },
        { count: 99, class: 'bg-red-500 text-white' },
        { count: 999, class: 'bg-red-500 text-white' },
    ];

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Badge Components</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Various badge styles for status indicators and notifications</p>
            </div>

            <div className="space-y-8">
                {/* Basic Badges */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Basic Badges</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex flex-wrap items-center gap-3">
                            {badgeVariants.map((variant) => (
                                <span
                                    key={variant.name}
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium ${variant.class}`}
                                >
                                    {variant.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Badge Sizes */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Badge Sizes</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex flex-wrap items-center gap-4">
                            {badgeSizes.map((size) => (
                                <div key={size.name} className="flex flex-col items-center space-y-2">
                                    <span className={`inline-flex items-center rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 font-medium ${size.class}`}>
                                        {size.name}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{size.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Badge Shapes */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Badge Shapes</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex flex-wrap items-center gap-4">
                            {badgeShapes.map((shape) => (
                                <div key={shape.name} className="flex flex-col items-center space-y-2">
                                    <span className={`inline-flex items-center bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 px-2.5 py-0.5 text-sm font-medium ${shape.class}`}>
                                        {shape.name}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{shape.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Status Badges */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Status Badges</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex flex-wrap items-center gap-3">
                            {statusBadges.map((status) => {
                                const Icon = status.icon;
                                return (
                                    <span
                                        key={status.name}
                                        className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-sm font-medium ${status.class}`}
                                    >
                                        <Icon className="h-3 w-3" />
                                        <span>{status.name}</span>
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Notification Badges */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Notification Badges</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex flex-wrap items-center gap-6">
                            {notificationBadges.map((badge, index) => (
                                <div key={index} className="flex flex-col items-center space-y-2">
                                    <div className="relative">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">🔔</span>
                                        </div>
                                        <span className={`absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium ${badge.class}`}>
                                            {badge.count > 99 ? '99+' : badge.count}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{badge.count} notification{badge.count !== 1 ? 's' : ''}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Badge with Icons */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Badges with Icons</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center space-x-1 rounded-full bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                <CheckIcon className="h-3 w-3" />
                                <span>Approved</span>
                            </span>
                            <span className="inline-flex items-center space-x-1 rounded-full bg-red-100 px-2.5 py-0.5 text-sm font-medium text-red-800 dark:bg-red-900/20 dark:text-red-400">
                                <XMarkIcon className="h-3 w-3" />
                                <span>Rejected</span>
                            </span>
                            <span className="inline-flex items-center space-x-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-sm font-medium text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                                <ExclamationTriangleIcon className="h-3 w-3" />
                                <span>Warning</span>
                            </span>
                            <span className="inline-flex items-center space-x-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                <InformationCircleIcon className="h-3 w-3" />
                                <span>Info</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Badge Examples */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Badge Examples</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="space-y-4">
                            {/* User Profile with Badge */}
                            <div className="flex items-center space-x-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white">
                                    <span className="text-sm font-medium">JD</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">John Doe</p>
                                    <div className="flex items-center space-x-2">
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                            Online
                                        </span>
                                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                            Admin
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Product with Badge */}
                            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
                                <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Premium Plan</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">$29/month</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                        Active
                                    </span>
                                    <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                                        Popular
                                    </span>
                                </div>
                            </div>

                            {/* Message with Badge */}
                            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
                                <div className="flex items-center space-x-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                                        <span className="text-xs text-gray-600 dark:text-gray-400">📧</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">New Message</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">You have 3 unread messages</p>
                                    </div>
                                </div>
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                                    3
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Badge with Close Button */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Dismissible Badges</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center space-x-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                <span>Dismissible</span>
                                <button className="ml-1 inline-flex h-3 w-3 items-center justify-center rounded-full hover:bg-blue-200 dark:hover:bg-blue-800">
                                    <XMarkIcon className="h-2 w-2" />
                                </button>
                            </span>
                            <span className="inline-flex items-center space-x-1 rounded-full bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                <span>Removable</span>
                                <button className="ml-1 inline-flex h-3 w-3 items-center justify-center rounded-full hover:bg-green-200 dark:hover:bg-green-800">
                                    <XMarkIcon className="h-2 w-2" />
                                </button>
                            </span>
                            <span className="inline-flex items-center space-x-1 rounded-full bg-red-100 px-2.5 py-0.5 text-sm font-medium text-red-800 dark:bg-red-900/20 dark:text-red-400">
                                <span>Closable</span>
                                <button className="ml-1 inline-flex h-3 w-3 items-center justify-center rounded-full hover:bg-red-200 dark:hover:bg-red-800">
                                    <XMarkIcon className="h-2 w-2" />
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UIBadge;
