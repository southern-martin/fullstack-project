import React from 'react';
import { UserIcon, CheckIcon } from '@heroicons/react/24/outline';

const UIAvatars: React.FC = () => {
    const avatarSizes = [
        { size: 'xs', class: 'h-6 w-6', text: 'text-xs' },
        { size: 'sm', class: 'h-8 w-8', text: 'text-sm' },
        { size: 'md', class: 'h-10 w-10', text: 'text-sm' },
        { size: 'lg', class: 'h-12 w-12', text: 'text-base' },
        { size: 'xl', class: 'h-16 w-16', text: 'text-lg' },
        { size: '2xl', class: 'h-20 w-20', text: 'text-xl' },
    ];

    const avatarVariants = [
        { name: 'Default', class: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' },
        { name: 'Primary', class: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' },
        { name: 'Success', class: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' },
        { name: 'Warning', class: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400' },
        { name: 'Danger', class: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' },
        { name: 'Purple', class: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' },
    ];

    const groupAvatars = [
        { name: 'John Doe', initials: 'JD', color: 'bg-blue-500' },
        { name: 'Jane Smith', initials: 'JS', color: 'bg-green-500' },
        { name: 'Mike Johnson', initials: 'MJ', color: 'bg-purple-500' },
        { name: 'Sarah Wilson', initials: 'SW', color: 'bg-pink-500' },
        { name: 'David Brown', initials: 'DB', color: 'bg-indigo-500' },
    ];

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Avatar Components</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Various avatar styles and sizes for user representation</p>
            </div>

            <div className="space-y-8">
                {/* Basic Avatars */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Basic Avatars</h3>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                            <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">With Image</h4>
                            <div className="flex items-center space-x-4">
                                <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                    alt="User avatar"
                                />
                                <img
                                    className="h-12 w-12 rounded-full object-cover ring-2 ring-white dark:ring-gray-800"
                                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                    alt="User avatar"
                                />
                                <img
                                    className="h-16 w-16 rounded-full object-cover ring-4 ring-blue-500"
                                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                    alt="User avatar"
                                />
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                            <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">With Initials</h4>
                            <div className="flex items-center space-x-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white">
                                    <span className="text-sm font-medium">JD</span>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white">
                                    <span className="text-base font-medium">JS</span>
                                </div>
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-500 text-white">
                                    <span className="text-lg font-medium">MJ</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Avatar Sizes */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Avatar Sizes</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center space-x-4">
                            {avatarSizes.map((size) => (
                                <div key={size.size} className="flex flex-col items-center space-y-2">
                                    <div className={`flex ${size.class} items-center justify-center rounded-full bg-blue-500 text-white`}>
                                        <span className={size.text}>JD</span>
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{size.size}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Avatar Variants */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Avatar Variants</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                            {avatarVariants.map((variant) => (
                                <div key={variant.name} className="flex flex-col items-center space-y-2">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${variant.class}`}>
                                        <UserIcon className="h-6 w-6" />
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{variant.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Avatar with Status */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Avatar with Status</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center space-x-6">
                            <div className="relative">
                                <img
                                    className="h-12 w-12 rounded-full object-cover"
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                    alt="User avatar"
                                />
                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-400 ring-2 ring-white dark:ring-gray-800"></span>
                            </div>
                            <div className="relative">
                                <img
                                    className="h-12 w-12 rounded-full object-cover"
                                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                    alt="User avatar"
                                />
                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-yellow-400 ring-2 ring-white dark:ring-gray-800"></span>
                            </div>
                            <div className="relative">
                                <img
                                    className="h-12 w-12 rounded-full object-cover"
                                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                    alt="User avatar"
                                />
                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-red-400 ring-2 ring-white dark:ring-gray-800"></span>
                            </div>
                            <div className="relative">
                                <img
                                    className="h-12 w-12 rounded-full object-cover"
                                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                    alt="User avatar"
                                />
                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-gray-400 ring-2 ring-white dark:ring-gray-800"></span>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center space-x-6 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                                <span className="h-2 w-2 rounded-full bg-green-400"></span>
                                <span>Online</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span className="h-2 w-2 rounded-full bg-yellow-400"></span>
                                <span>Away</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span className="h-2 w-2 rounded-full bg-red-400"></span>
                                <span>Busy</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span className="h-2 w-2 rounded-full bg-gray-400"></span>
                                <span>Offline</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Group Avatars */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Group Avatars</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex -space-x-2">
                                    {groupAvatars.slice(0, 3).map((person, index) => (
                                        <div
                                            key={index}
                                            className={`flex h-10 w-10 items-center justify-center rounded-full ${person.color} text-white ring-2 ring-white dark:ring-gray-800`}
                                        >
                                            <span className="text-sm font-medium">{person.initials}</span>
                                        </div>
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">3 team members</span>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="flex -space-x-2">
                                    {groupAvatars.slice(0, 5).map((person, index) => (
                                        <div
                                            key={index}
                                            className={`flex h-10 w-10 items-center justify-center rounded-full ${person.color} text-white ring-2 ring-white dark:ring-gray-800`}
                                        >
                                            <span className="text-sm font-medium">{person.initials}</span>
                                        </div>
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">5 team members</span>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="flex -space-x-2">
                                    {groupAvatars.slice(0, 4).map((person, index) => (
                                        <div
                                            key={index}
                                            className={`flex h-10 w-10 items-center justify-center rounded-full ${person.color} text-white ring-2 ring-white dark:ring-gray-800`}
                                        >
                                            <span className="text-sm font-medium">{person.initials}</span>
                                        </div>
                                    ))}
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600 ring-2 ring-white dark:bg-gray-700 dark:text-gray-300 dark:ring-gray-800">
                                        <span className="text-sm font-medium">+2</span>
                                    </div>
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">6+ team members</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Avatar with Badge */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Avatar with Badge</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center space-x-6">
                            <div className="relative">
                                <img
                                    className="h-12 w-12 rounded-full object-cover"
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                    alt="User avatar"
                                />
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                    3
                                </span>
                            </div>
                            <div className="relative">
                                <img
                                    className="h-12 w-12 rounded-full object-cover"
                                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                    alt="User avatar"
                                />
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                                    <CheckIcon className="h-3 w-3" />
                                </span>
                            </div>
                            <div className="relative">
                                <img
                                    className="h-12 w-12 rounded-full object-cover"
                                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                    alt="User avatar"
                                />
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-white">
                                    <span className="text-xs">!</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UIAvatars;
