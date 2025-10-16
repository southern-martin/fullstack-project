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

interface HeaderProps {
    darkMode: boolean;
    setDarkMode: (darkMode: boolean) => void;
    sidebarToggle: boolean;
    setSidebarToggle: (toggle: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode, sidebarToggle, setSidebarToggle }) => {
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

    const notifications = [
        { id: 1, message: 'User Terry Franci requests permission to changeProject - Nganter App Project', time: '5 min ago', unread: true },
        { id: 2, message: 'User Alena Franci requests permission to changeProject - Nganter App Project', time: '8 min ago', unread: true },
        { id: 3, message: 'User Jocelyn Kenter requests permission to changeProject - Nganter App Project', time: '15 min ago', unread: true },
        { id: 4, message: 'User Brandon Philips requests permission to changeProject - Nganter App Project', time: '1 hr ago', unread: true },
        { id: 5, message: 'New order received from Tech Solutions Inc', time: '2 hr ago', unread: false },
        { id: 6, message: 'Payment processed for Invoice #INV-003', time: '3 hr ago', unread: false },
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

    const handleNotificationClick = (notificationId: number) => {
        // Mark notification as read
        console.log('Notification clicked:', notificationId);
        setShowNotifications(false);
    };

    const handleViewAllNotifications = () => {
        console.log('View all notifications');
        setShowNotifications(false);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <header className="header sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-gray-800 dark:drop-shadow-none">
            <div className="flex flex-grow items-center justify-between px-4 py-3 shadow-2 md:px-6 2xl:px-11">
                <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
                    <button
                        onClick={() => setSidebarToggle(!sidebarToggle)}
                        className="z-99999 flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 lg:hidden"
                    >
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
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent xl:w-125 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                                <div className="absolute right-0 mt-2.5 flex max-h-96 w-80 flex-col rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-600 dark:bg-gray-800">
                                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                        <h5 className="text-sm font-medium text-gray-900 dark:text-white">Notifications</h5>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{unreadCount} unread</p>
                                    </div>
                                    <div className="flex-1 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                                {notifications.map((notification) => (
                                                    <li key={notification.id}>
                                                        <button
                                                            onClick={() => handleNotificationClick(notification.id)}
                                                            className={`w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 text-left ${notification.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                                                        >
                                                            <div className="flex items-start space-x-3">
                                                                <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm text-gray-900 dark:text-white leading-5">
                                                                        {notification.message}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                        {notification.time}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="px-4 py-8 text-center">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">No notifications</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                                        <button
                                            onClick={handleViewAllNotifications}
                                            className="w-full text-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                        >
                                            View All Notifications
                                        </button>
                                    </div>
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
                                    <span className="block text-xs font-semibold text-gray-900 dark:text-white">
                                        Musharof
                                    </span>
                                    <span className="block text-xs text-gray-500 dark:text-gray-400">Musharof Chowdhury</span>
                                </span>
                                <div className="h-8 w-8 rounded-full overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                            </button>

                            {/* User dropdown */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-4 flex w-62.5 flex-col rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-600 dark:bg-gray-800">
                                    <ul className="flex flex-col gap-4 border-b border-stroke px-6 py-6 dark:border-strokedark">
                                        <li>
                                            <button
                                                onClick={() => handleUserMenuAction('profile')}
                                                className="flex items-center gap-3.5 text-xs font-medium duration-300 ease-in-out hover:text-primary"
                                            >
                                                <UserIcon className="w-4 h-4" />
                                                Edit profile
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                onClick={() => handleUserMenuAction('settings')}
                                                className="flex items-center gap-3.5 text-xs font-medium duration-300 ease-in-out hover:text-primary"
                                            >
                                                <CogIcon className="w-4 h-4" />
                                                Account settings
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                onClick={() => handleUserMenuAction('support')}
                                                className="flex items-center gap-3.5 text-xs font-medium duration-300 ease-in-out hover:text-primary"
                                            >
                                                <BellIcon className="w-4 h-4" />
                                                Support
                                            </button>
                                        </li>
                                    </ul>
                                    <button
                                        onClick={() => handleUserMenuAction('logout')}
                                        className="flex items-center gap-3.5 py-3 px-6 text-xs font-medium duration-300 ease-in-out hover:text-primary"
                                    >
                                        <ArrowRightOnRectangleIcon className="w-4 h-4" />
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