import {
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    CalculatorIcon,
    ChartBarIcon,
    CogIcon,
    GlobeAltIcon,
    HomeIcon,
    MoonIcon,
    ServerIcon,
    SunIcon,
    TruckIcon,
    UserCircleIcon,
    UserGroupIcon,
    UsersIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useAuthContext } from '../../../app/providers/AuthProvider';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { ROUTES } from '../../../config/api';
import ThemeToggle from '../ThemeToggle';

interface NavigationProps {
    isOpen: boolean;
    onToggle: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isOpen, onToggle }) => {
    const location = useLocation();
    const { user, logout } = useAuthContext();
    const { theme, toggleTheme } = useTheme();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const navigationItems = [
        {
            name: 'Dashboard',
            href: ROUTES.DASHBOARD,
            icon: HomeIcon,
            current: location.pathname === ROUTES.DASHBOARD,
        },
        {
            name: 'Microservices',
            href: '/microservices',
            icon: ServerIcon,
            current: location.pathname === '/microservices',
        },
        {
            name: 'Users',
            href: ROUTES.USERS,
            icon: UsersIcon,
            current: location.pathname === ROUTES.USERS,
        },
        {
            name: 'Customers',
            href: ROUTES.CUSTOMERS,
            icon: UserGroupIcon,
            current: location.pathname === ROUTES.CUSTOMERS,
        },
        {
            name: 'Carriers',
            href: ROUTES.CARRIERS,
            icon: TruckIcon,
            current: location.pathname === ROUTES.CARRIERS,
        },
        {
            name: 'Pricing',
            href: ROUTES.PRICING,
            icon: CalculatorIcon,
            current: location.pathname === ROUTES.PRICING,
        },
        {
            name: 'Translations',
            href: ROUTES.TRANSLATIONS,
            icon: GlobeAltIcon,
            current: location.pathname === ROUTES.TRANSLATIONS,
        },
        {
            name: 'Analytics',
            href: ROUTES.ANALYTICS,
            icon: ChartBarIcon,
            current: location.pathname === ROUTES.ANALYTICS,
        },
        {
            name: 'Settings',
            href: ROUTES.SETTINGS,
            icon: CogIcon,
            current: location.pathname === ROUTES.SETTINGS,
        },
    ];

    const handleLogout = async () => {
        await logout();
    };

    return (
        <>
            {/* Mobile menu button */}
            <div className="lg:hidden">
                <button
                    type="button"
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                    onClick={onToggle}
                >
                    <span className="sr-only">Open main menu</span>
                    {isOpen ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                </button>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:flex lg:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <div className="professional-sidebar flex flex-col h-0 flex-1">
                        {/* Logo */}
                        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                            <div className="flex items-center flex-shrink-0 px-4">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{
                                            background: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-secondary-500) 100%)',
                                            boxShadow: 'var(--shadow-lg)'
                                        }}>
                                            <span className="text-white font-bold text-lg">RA</span>
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <h1 className="text-xl font-bold professional-text-gradient">React Admin</h1>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="mt-5 flex-1 px-2 space-y-1">
                                {navigationItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className={`nav-item group flex items-center px-3 py-3 text-sm font-medium transition-all duration-300 ${item.current
                                                ? 'active'
                                                : ''
                                                }`}
                                        >
                                            <Icon
                                                className={`mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200 ${item.current ? 'text-white' : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-white'
                                                    }`}
                                                aria-hidden="true"
                                            />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* User profile */}
                        <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
                            <div className="flex items-center w-full">
                                <div className="flex-shrink-0">
                                    <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {user?.firstName?.charAt(0) || 'U'}
                                        </span>
                                    </div>
                                </div>
                                <div className="ml-3 flex-1">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                                        {user?.firstName} {user?.lastName}
                                    </p>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                                        {user?.email}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {/* Theme toggle */}
                                    <button
                                        onClick={toggleTheme}
                                        className="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                                    >
                                        {theme === 'light' ? (
                                            <MoonIcon className="h-5 w-5" />
                                        ) : (
                                            <SunIcon className="h-5 w-5" />
                                        )}
                                    </button>

                                    {/* Profile dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                                            className="flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <UserCircleIcon className="h-5 w-5" />
                                        </button>

                                        {/* Profile dropdown */}
                                        {isProfileOpen && (
                                            <div className="absolute right-0 bottom-full mb-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                                                    Sign out
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile sidebar */}
            {isOpen && (
                <div className="lg:hidden">
                    <div className="fixed inset-0 flex z-40">
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onToggle} />
                        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                            <div className="absolute top-0 right-0 -mr-12 pt-2">
                                <button
                                    type="button"
                                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                    onClick={onToggle}
                                >
                                    <span className="sr-only">Close sidebar</span>
                                    <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                </button>
                            </div>

                            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                                <div className="flex-shrink-0 flex items-center px-4">
                                    <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">RA</span>
                                    </div>
                                    <h1 className="ml-3 text-lg font-semibold text-gray-900">React Admin</h1>
                                </div>

                                <nav className="mt-5 px-2 space-y-1">
                                    {navigationItems.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={item.name}
                                                to={item.href}
                                                onClick={onToggle}
                                                className={`${item.current
                                                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                                                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                    } group flex items-center px-2 py-2 text-base font-medium rounded-md border-l-4`}
                                            >
                                                <Icon
                                                    className={`${item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                                                        } mr-4 flex-shrink-0 h-6 w-6`}
                                                    aria-hidden="true"
                                                />
                                                {item.name}
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>

                            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                                <div className="flex items-center w-full">
                                    <div className="flex-shrink-0">
                                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                            <span className="text-sm font-medium text-gray-700">
                                                {user?.firstName?.charAt(0) || 'U'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <p className="text-sm font-medium text-gray-700">
                                            {user?.firstName} {user?.lastName}
                                        </p>
                                        <p className="text-xs font-medium text-gray-500">
                                            {user?.email}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <ThemeToggle size="sm" />
                                        <button
                                            onClick={handleLogout}
                                            className="flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-500"
                                        >
                                            <ArrowRightOnRectangleIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navigation;
