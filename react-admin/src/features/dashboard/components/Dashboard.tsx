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
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../app/providers/AuthProvider';
import { ROUTES } from '../../../config/api';
import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import Loading from '../../../shared/components/ui/Loading';
import { dashboardService, DashboardStats } from '../services/dashboardService';
import { useDashboardLabels } from '../hooks/useDashboardLabels';
import EcommerceDashboard from './EcommerceDashboard';

const Dashboard: React.FC = () => {
    const { L } = useDashboardLabels();
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dashboardType, setDashboardType] = useState<'admin' | 'ecommerce'>('admin');

    const loadDashboardStats = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const dashboardStats = await dashboardService.getDashboardStats();
            setStats(dashboardStats);
        } catch (err) {
            setError(L.messages.failedLoad);
        } finally {
            setLoading(false);
        }
    }, [L.messages.failedLoad]);

    useEffect(() => {
        loadDashboardStats();
    }, [loadDashboardStats]);

    const dashboardCards = [
        {
            title: L.cards.usersTitle,
            description: L.cards.usersDescription,
            icon: UsersIcon,
            iconColor: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            borderColor: 'border-blue-200 dark:border-blue-800',
            buttonText: L.cards.usersButton,
            buttonColor: 'primary' as const,
            onClick: () => navigate(ROUTES.USERS),
            stats: stats?.totalUsers || 0,
        },
        {
            title: L.cards.customersTitle,
            description: L.cards.customersDescription,
            icon: UserGroupIcon,
            iconColor: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            borderColor: 'border-green-200 dark:border-green-800',
            buttonText: L.cards.customersButton,
            buttonColor: 'success' as const,
            onClick: () => navigate(ROUTES.CUSTOMERS),
            stats: stats?.totalCustomers || 0,
        },
        {
            title: L.cards.carriersTitle,
            description: L.cards.carriersDescription,
            icon: TruckIcon,
            iconColor: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            borderColor: 'border-purple-200 dark:border-purple-800',
            buttonText: L.cards.carriersButton,
            buttonColor: 'secondary' as const,
            onClick: () => navigate(ROUTES.CARRIERS),
            stats: stats?.totalCarriers || 0,
        },
        {
            title: L.cards.analyticsTitle,
            description: L.cards.analyticsDescription,
            icon: ChartBarIcon,
            iconColor: 'text-orange-600 dark:text-orange-400',
            bgColor: 'bg-orange-50 dark:bg-orange-900/20',
            borderColor: 'border-orange-200 dark:border-orange-800',
            buttonText: L.cards.analyticsButton,
            buttonColor: 'primary' as const,
            onClick: () => navigate(ROUTES.ANALYTICS),
            stats: L.stats.reports,
        },
        {
            title: L.cards.settingsTitle,
            description: L.cards.settingsDescription,
            icon: CogIcon,
            iconColor: 'text-gray-600 dark:text-gray-400',
            bgColor: 'bg-gray-50 dark:bg-gray-700/50',
            borderColor: 'border-gray-200 dark:border-gray-600',
            buttonText: L.cards.settingsButton,
            buttonColor: 'secondary' as const,
            onClick: () => navigate(ROUTES.SETTINGS),
            stats: L.stats.config,
        },
    ];

    return (
        <div>
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{L.page.title}</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            {L.page.welcome}, {user?.firstName || 'User'}!
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <Button
                            variant={dashboardType === 'admin' ? 'primary' : 'secondary'}
                            onClick={() => setDashboardType('admin')}
                            size="sm"
                        >
                            {L.buttons.adminDashboard}
                        </Button>
                        <Button
                            variant={dashboardType === 'ecommerce' ? 'primary' : 'secondary'}
                            onClick={() => setDashboardType('ecommerce')}
                            size="sm"
                        >
                            {L.buttons.ecommerceDashboard}
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
                            {L.page.adminDashboardTitle}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            {L.page.subtitle}
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
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{L.stats.total}</div>
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
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{L.system.overview}</h3>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {L.system.lastUpdated}: {new Date().toLocaleTimeString()}
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
                                        <p className="text-red-800 dark:text-red-200 font-medium">{L.messages.failedLoadStats}</p>
                                        <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="secondary"
                                    onClick={loadDashboardStats}
                                    className="mt-4"
                                >
                                    {L.buttons.retry}
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
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{L.stats.totalUsers}</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalUsers.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-green-600 dark:text-green-400 font-medium">+12%</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{L.stats.vsLastMonth}</div>
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
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{L.stats.totalCustomers}</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalCustomers.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-green-600 dark:text-green-400 font-medium">+8%</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{L.stats.vsLastMonth}</div>
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
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{L.stats.totalCarriers}</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalCarriers.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-green-600 dark:text-green-400 font-medium">+5%</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{L.stats.vsLastMonth}</div>
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
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{L.stats.systemStatus}</p>
                                                <p className={`text-2xl font-bold capitalize ${stats.systemHealth.status === 'healthy' ? 'text-green-600 dark:text-green-400' :
                                                    stats.systemHealth.status === 'warning' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                                                    }`}>
                                                    {stats.systemHealth.status}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{L.stats.uptime}</div>
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
                                        <p className="text-yellow-800 dark:text-yellow-200 font-medium">{L.messages.noStats}</p>
                                        <p className="text-yellow-600 dark:text-yellow-300 text-sm">{L.messages.apiConnectivity}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="secondary"
                                    onClick={loadDashboardStats}
                                    className="mt-4"
                                >
                                    {L.buttons.retry}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Recent Users Section */}
                    {stats && stats.recentUsers.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">{L.system.recentUsers}</h3>
                            <Card>
                                <div className="overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {L.table.name}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {L.table.email}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {L.table.status}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {L.table.created}
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
                                                            {user.isActive ? L.status.active : L.status.inactive}
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
                                {L.messages.success}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
