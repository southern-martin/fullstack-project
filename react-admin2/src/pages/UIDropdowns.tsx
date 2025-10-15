import { ArrowRightOnRectangleIcon, BellIcon, ChevronDownIcon, CogIcon, EyeIcon, PencilIcon, TrashIcon, UserIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useRef, useState } from 'react';

const UIDropdowns: React.FC = () => {
    const [isOpen, setIsOpen] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = (id: string) => {
        setIsOpen(isOpen === id ? null : id);
    };

    const menuItems = [
        { name: 'Profile', icon: UserIcon, href: '#' },
        { name: 'Settings', icon: CogIcon, href: '#' },
        { name: 'Notifications', icon: BellIcon, href: '#' },
        { name: 'Sign out', icon: ArrowRightOnRectangleIcon, href: '#', divider: true },
    ];

    const actionItems = [
        { name: 'View', icon: EyeIcon, href: '#' },
        { name: 'Edit', icon: PencilIcon, href: '#' },
        { name: 'Delete', icon: TrashIcon, href: '#', danger: true },
    ];

    const statusOptions = [
        { name: 'Active', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
        { name: 'Inactive', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' },
        { name: 'Pending', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
        { name: 'Suspended', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
    ];

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Dropdown Components</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Various dropdown menus and selectors</p>
            </div>

            <div className="space-y-8">
                {/* Basic Dropdown */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Basic Dropdown</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex flex-wrap gap-4">
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => toggleDropdown('basic')}
                                    className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                >
                                    <span>Options</span>
                                    <ChevronDownIcon className="h-4 w-4" />
                                </button>

                                {isOpen === 'basic' && (
                                    <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                                        <div className="py-1">
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                Option 1
                                            </a>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                Option 2
                                            </a>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                Option 3
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Menu Dropdown */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">User Menu Dropdown</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex justify-center">
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => toggleDropdown('user')}
                                    className="flex items-center space-x-3 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">JD</span>
                                    </div>
                                    <span>John Doe</span>
                                    <ChevronDownIcon className="h-4 w-4" />
                                </button>

                                {isOpen === 'user' && (
                                    <div className="absolute top-full right-0 mt-1 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">John Doe</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">john@example.com</p>
                                        </div>
                                        <div className="py-1">
                                            {menuItems.map((item, index) => (
                                                <div key={index}>
                                                    <a
                                                        href={item.href}
                                                        className={`flex items-center space-x-3 px-4 py-2 text-sm ${item.name === 'Sign out'
                                                                ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                            }`}
                                                    >
                                                        <item.icon className="h-4 w-4" />
                                                        <span>{item.name}</span>
                                                    </a>
                                                    {item.divider && <div className="border-t border-gray-200 dark:border-gray-700 my-1" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Dropdown */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Action Dropdown</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex justify-center">
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => toggleDropdown('actions')}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                >
                                    <span>Actions</span>
                                    <ChevronDownIcon className="h-4 w-4" />
                                </button>

                                {isOpen === 'actions' && (
                                    <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                                        <div className="py-1">
                                            {actionItems.map((item, index) => (
                                                <a
                                                    key={index}
                                                    href={item.href}
                                                    className={`flex items-center space-x-3 px-4 py-2 text-sm ${item.danger
                                                            ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                        }`}
                                                >
                                                    <item.icon className="h-4 w-4" />
                                                    <span>{item.name}</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Dropdown */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Status Dropdown</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex justify-center">
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => toggleDropdown('status')}
                                    className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                >
                                    <span>Select Status</span>
                                    <ChevronDownIcon className="h-4 w-4" />
                                </button>

                                {isOpen === 'status' && (
                                    <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                                        <div className="py-1">
                                            {statusOptions.map((status, index) => (
                                                <button
                                                    key={index}
                                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                                                        {status.name}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Multi-level Dropdown */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Multi-level Dropdown</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex justify-center">
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => toggleDropdown('multilevel')}
                                    className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                >
                                    <span>Categories</span>
                                    <ChevronDownIcon className="h-4 w-4" />
                                </button>

                                {isOpen === 'multilevel' && (
                                    <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                                        <div className="py-1">
                                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Products
                                            </div>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                Electronics
                                            </a>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                Clothing
                                            </a>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                Books
                                            </a>

                                            <div className="border-t border-gray-200 dark:border-gray-700 my-1" />

                                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Services
                                            </div>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                Consulting
                                            </a>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                Support
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dropdown with Search */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Dropdown with Search</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex justify-center">
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => toggleDropdown('search')}
                                    className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                >
                                    <span>Select User</span>
                                    <ChevronDownIcon className="h-4 w-4" />
                                </button>

                                {isOpen === 'search' && (
                                    <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                                        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                                            <input
                                                type="text"
                                                placeholder="Search users..."
                                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="py-1 max-h-48 overflow-y-auto">
                                            {['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown'].map((user, index) => (
                                                <button
                                                    key={index}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3"
                                                >
                                                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                                            {user.split(' ').map(n => n[0]).join('')}
                                                        </span>
                                                    </div>
                                                    <span>{user}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dropdown Positions */}
                <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Dropdown Positions</h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => toggleDropdown('left')}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                >
                                    <span>Left Aligned</span>
                                    <ChevronDownIcon className="h-4 w-4" />
                                </button>

                                {isOpen === 'left' && (
                                    <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                                        <div className="py-1">
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                Option 1
                                            </a>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                Option 2
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => toggleDropdown('right')}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                >
                                    <span>Right Aligned</span>
                                    <ChevronDownIcon className="h-4 w-4" />
                                </button>

                                {isOpen === 'right' && (
                                    <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                                        <div className="py-1">
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                Option 1
                                            </a>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                Option 2
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UIDropdowns;
