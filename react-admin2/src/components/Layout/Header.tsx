import {
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    BellIcon,
    ChevronDownIcon,
    CogIcon,
    MagnifyingGlassIcon,
    MoonIcon,
    SunIcon,
    UserIcon,
} from '@heroicons/react/24/outline';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

    const notifications = [
        { id: 1, message: 'User Terry Franci requests permission to changeProject - Nganter App Project', time: '5 min ago', unread: true },
        { id: 2, message: 'User Alena Franci requests permission to changeProject - Nganter App Project', time: '8 min ago', unread: true },
        { id: 3, message: 'User Jocelyn Kenter requests permission to changeProject - Nganter App Project', time: '15 min ago', unread: true },
        { id: 4, message: 'User Brandon Philips requests permission to changeProject - Nganter App Project', time: '1 hr ago', unread: true },
        { id: 5, message: 'User Terry Franci requests permission to changeProject - Nganter App Project', time: '5 min ago', unread: false },
        { id: 6, message: 'User Alena Franci requests permission to changeProject - Nganter App Project', time: '8 min ago', unread: false },
        { id: 7, message: 'User Jocelyn Kenter requests permission to changeProject - Nganter App Project', time: '15 min ago', unread: false },
        { id: 8, message: 'User Brandon Philips requests permission to changeProject - Nganter App Project', time: '1 hr ago', unread: false },
    ];

    const unreadCount = notifications.filter(n => n.unread).length;

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleUserMenuAction = (action: string) => {
        setShowUserMenu(false);
        switch (action) {
            case 'profile':
                navigate('/profile');
                break;
            case 'settings':
                navigate('/settings');
                break;
            case 'logout':
                navigate('/login');
                break;
            default:
                break;
        }
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        // Toggle dark mode on document
        document.documentElement.classList.toggle('dark');
    };

    return (
        <header className="header sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-gray-800 dark:drop-shadow-none">
            <div className="flex flex-grow items-center justify-between px-4 py-3 shadow-2 md:px-6 2xl:px-11">
                <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
                    <button className="z-99999 flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 lg:hidden">
                        <Bars3Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                </div>

                <div className="hidden sm:block">
                    <div className="relative">
                        <button className="absolute left-3 top-1/2 -translate-y-1/2">
                            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
                        </button>
                        <input
                            type="text"
                            placeholder="⌘ K"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent xl:w-125 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 2xsm:gap-7">
                    <ul className="flex items-center gap-2 2xsm:gap-4">
                        {/* Dark Mode Toggle */}
                        <li>
                            <button
                                onClick={toggleDarkMode}
                                className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                            >
                                {darkMode ? (
                                    <SunIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                ) : (
                                    <MoonIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                )}
                            </button>
                        </li>

                        {/* Notifications */}
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                            >
                                <BellIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
                                    </span>
                                )}
                            </button>

                            {/* Notifications dropdown */}
                            {showNotifications && (
                                <div className="absolute -right-27 mt-2.5 flex h-90 w-75 flex-col rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-600 dark:bg-gray-800 sm:right-0 sm:w-80">
                                    <div className="px-4.5 py-3">
                                        <h5 className="text-sm font-medium text-bodydark2">Notification</h5>
                                    </div>
                                    <ul className="flex h-auto flex-col overflow-y-auto">
                                        {notifications.map((notification) => (
                                            <li key={notification.id}>
                                                <div className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4">
                                                    <p className="text-sm">
                                                        <span className="text-black dark:text-white">
                                                            {notification.message}
                                                        </span>
                                                    </p>
                                                    <p className="text-xs">{notification.time}</p>
                                                </div>
                                            </li>
                                        ))}
                                        <li>
                                            <div className="px-4.5 py-3">
                                                <button className="text-sm text-primary hover:text-opacity-80">
                                                    View All Notification
                                                </button>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* User menu */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                <span className="hidden text-right lg:block">
                                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                                        Musharof
                                    </span>
                                    <span className="block text-xs text-gray-500 dark:text-gray-400">Musharof Chowdhury</span>
                                </span>
                                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                                    <span className="text-white text-sm font-semibold">M</span>
                                </div>
                                <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                            </button>

                            {/* User dropdown */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-4 flex w-62.5 flex-col rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-600 dark:bg-gray-800">
                                    <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
                                        <li>
                                            <button
                                                onClick={() => handleUserMenuAction('profile')}
                                                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                                            >
                                                <UserIcon className="w-5 h-5" />
                                                Edit profile
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                onClick={() => handleUserMenuAction('settings')}
                                                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                                            >
                                                <CogIcon className="w-5 h-5" />
                                                Account settings
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                onClick={() => handleUserMenuAction('support')}
                                                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                                            >
                                                <BellIcon className="w-5 h-5" />
                                                Support
                                            </button>
                                        </li>
                                    </ul>
                                    <button
                                        onClick={() => handleUserMenuAction('logout')}
                                        className="flex items-center gap-3.5 py-4 px-6 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                                    >
                                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default Header;