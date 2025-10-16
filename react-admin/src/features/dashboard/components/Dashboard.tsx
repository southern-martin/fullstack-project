import {
    ArrowRightIcon,
    ChartBarIcon,
    CheckCircleIcon,
    CogIcon,
    ExclamationTriangleIcon,
    TruckIcon,
    UserGroupIcon,
    UsersIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../app/providers/AuthProvider';
import { ROUTES } from '../../../config/api';
import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import Loading from '../../../shared/components/ui/Loading';
import { dashboardService, DashboardStats } from '../services/dashboardService';
import EcommerceDashboard from './EcommerceDashboard';

const Dashboard: React.FC = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dashboardType, setDashboardType] = useState<'admin' | 'ecommerce'>('admin');

    useEffect(() => {
        loadDashboardStats();
    }, []);

    const loadDashboardStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const dashboardStats = await dashboardService.getDashboardStats();
            setStats(dashboardStats);
        } catch (err) {
            setError('Failed to load dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    const dashboardCards = [
        {
            title: 'Users',
            description: 'Manage user accounts and permissions',
            icon: UsersIcon,
            iconColor: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            borderColor: 'border-blue-200 dark:border-blue-800',
            buttonText: 'View Users',
            buttonColor: 'primary' as const,
            onClick: () => navigate(ROUTES.USERS),
            stats: stats?.totalUsers || 0,
        },
        {
            title: 'Customers',
            description: 'Manage customer accounts and information',
            icon: UserGroupIcon,
            iconColor: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            borderColor: 'border-green-200 dark:border-green-800',
            buttonText: 'View Customers',
            buttonColor: 'success' as const,
            onClick: () => navigate(ROUTES.CUSTOMERS),
            stats: stats?.totalCustomers || 0,
        },
        {
            title: 'Carriers',
            description: 'Manage shipping carriers and logistics',
            icon: TruckIcon,
            iconColor: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            borderColor: 'border-purple-200 dark:border-purple-800',
            buttonText: 'View Carriers',
            buttonColor: 'secondary' as const,
            onClick: () => navigate(ROUTES.CARRIERS),
            stats: stats?.totalCarriers || 0,
        },
        {
            title: 'Analytics',
            description: 'View system analytics and reports',
            icon: ChartBarIcon,
            iconColor: 'text-orange-600 dark:text-orange-400',
            bgColor: 'bg-orange-50 dark:bg-orange-900/20',
            borderColor: 'border-orange-200 dark:border-orange-800',
            buttonText: 'View Analytics',
            buttonColor: 'primary' as const,
            onClick: () => navigate(ROUTES.ANALYTICS),
            stats: 'Reports',
        },
        {
            title: 'Settings',
            description: 'Configure system settings',
            icon: CogIcon,
            iconColor: 'text-gray-600 dark:text-gray-400',
            bgColor: 'bg-gray-50 dark:bg-gray-700/50',
            borderColor: 'border-gray-200 dark:border-gray-600',
            buttonText: 'View Settings',
            buttonColor: 'secondary' as const,
            onClick: () => navigate(ROUTES.SETTINGS),
            stats: 'Config',
        },
    ];

    return (
        <div>
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Welcome back, {user?.firstName || 'User'}!
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <Button
                            variant={dashboardType === 'admin' ? 'primary' : 'secondary'}
                            onClick={() => setDashboardType('admin')}
                            size="sm"
                        >
                            Admin Dashboard
                        </Button>
                        <Button
                            variant={dashboardType === 'ecommerce' ? 'primary' : 'secondary'}
                            onClick={() => setDashboardType('ecommerce')}
                            size="sm"
                        >
                            Ecommerce Dashboard
                        </Button>
                    </div>
                </div>
            </div>

            {/* Dashboard Content */}
            {dashboardType === 'ecommerce' ? (
                <EcommerceDashboard />
            ) : (
                <div>
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                            🚀 React Admin Dashboard
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            Manage your application with ease
                        </p>
                    </div>

                    {/* Dashboard Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {dashboardCards.map((card, index) => {
                            const IconComponent = card.icon;
                            return (
                                <div
                                    key={index}
                                    className={`relative overflow-hidden rounded-xl border-2 ${card.borderColor} bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group`}
                                    onClick={card.onClick}
                                >
                                    {/* Background Pattern */}
                                    <div className={`absolute top-0 right-0 w-32 h-32 ${card.bgColor} rounded-full -translate-y-16 translate-x-16 opacity-20`}></div>

                                    <div className="relative p-6">
                                        {/* Icon and Stats */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`p-3 rounded-lg ${card.bgColor}`}>
                                                <IconComponent className={`h-6 w-6 ${card.iconColor}`} />
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                                    {typeof card.stats === 'number' ? card.stats.toLocaleString() : card.stats}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
                                            </div>
                                        </div>

                                        {/* Title and Description */}
                                        <div className="mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                                {card.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                                {card.description}
                                            </p>
                                        </div>

                                        {/* Action Button */}
                                        <div className="flex items-center justify-between">
                                            <Button
                                                variant={card.buttonColor}
                                                size="sm"
                                                className="group-hover:scale-105 transition-transform duration-200"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    card.onClick();
                                                }}
                                            >
                                                {card.buttonText}
                                            </Button>
                                            <ArrowRightIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-200" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Stats Section */}
                    <div className="mt-12">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">System Overview</h3>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Last updated: {new Date().toLocaleTimeString()}
                            </div>
                        </div>
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                                        <Loading size="sm" text="" />
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 shadow-sm">
                                <div className="flex items-center">
                                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400 mr-3" />
                                    <div>
                                        <p className="text-red-800 dark:text-red-200 font-medium">Failed to load statistics</p>
                                        <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="secondary"
                                    onClick={loadDashboardStats}
                                    className="mt-4"
                                >
                                    Retry
                                </Button>
                            </div>
                        ) : stats ? (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                <UsersIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalUsers.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-green-600 dark:text-green-400 font-medium">+12%</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">vs last month</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                <UserGroupIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Customers</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalCustomers.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-green-600 dark:text-green-400 font-medium">+8%</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">vs last month</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                                <TruckIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Carriers</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalCarriers.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-green-600 dark:text-green-400 font-medium">+5%</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">vs last month</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className={`p-3 rounded-lg ${stats.systemHealth.status === 'healthy' ? 'bg-green-50 dark:bg-green-900/20' :
                                                stats.systemHealth.status === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-red-50 dark:bg-red-900/20'
                                                }`}>
                                                {stats.systemHealth.status === 'healthy' ? (
                                                    <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                                                ) : stats.systemHealth.status === 'warning' ? (
                                                    <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                                                ) : (
                                                    <XCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">System Status</p>
                                                <p className={`text-2xl font-bold capitalize ${stats.systemHealth.status === 'healthy' ? 'text-green-600 dark:text-green-400' :
                                                    stats.systemHealth.status === 'warning' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                                                    }`}>
                                                    {stats.systemHealth.status}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Uptime</div>
                                            <div className="text-xs font-medium text-gray-900 dark:text-gray-100">99.9%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 shadow-sm">
                                <div className="flex items-center">
                                    <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-3" />
                                    <div>
                                        <p className="text-yellow-800 dark:text-yellow-200 font-medium">No statistics available</p>
                                        <p className="text-yellow-600 dark:text-yellow-300 text-sm">This might be due to API connectivity issues.</p>
                                    </div>
                                </div>
                                <Button
                                    variant="secondary"
                                    onClick={loadDashboardStats}
                                    className="mt-4"
                                >
                                    Retry
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Recent Users Section */}
                    {stats && stats.recentUsers.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>
                            <Card>
                                <div className="overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Email
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Created
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {stats.recentUsers.map((user) => (
                                                <tr key={user.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-8 w-8">
                                                                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                                                    <span className="text-sm font-medium text-gray-700">
                                                                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {user.firstName} {user.lastName}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {user.isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(user.createdAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </div>
                    )}


                    {/* Success Message */}
                    <div className="mt-8 text-center">
                        <div className="bg-green-50 border border-green-200 rounded-md p-4">
                            <p className="text-green-800">
                                ✅ React + TypeScript + Modern Architecture is working perfectly!
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
