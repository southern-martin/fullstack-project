import {
    CheckCircleIcon,
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

const Dashboard: React.FC = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
            buttonText: 'View Users',
            buttonColor: 'primary' as const,
            onClick: () => navigate(ROUTES.USERS),
        },
        {
            title: 'Customers',
            description: 'Manage customer accounts and information',
            buttonText: 'View Customers',
            buttonColor: 'success' as const,
            onClick: () => navigate(ROUTES.CUSTOMERS),
        },
        {
            title: 'Carriers',
            description: 'Manage shipping carriers and logistics',
            buttonText: 'View Carriers',
            buttonColor: 'secondary' as const,
            onClick: () => navigate(ROUTES.CARRIERS),
        },
        {
            title: 'Analytics',
            description: 'View system analytics and reports',
            buttonText: 'View Analytics',
            buttonColor: 'primary' as const,
            onClick: () => navigate(ROUTES.ANALYTICS),
        },
        {
            title: 'Settings',
            description: 'Configure system settings',
            buttonText: 'View Settings',
            buttonColor: 'secondary' as const,
            onClick: () => navigate(ROUTES.SETTINGS),
        },
    ];

    return (
        <div>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">
                    Welcome back, {user?.firstName || 'User'}!
                </p>
            </div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    🚀 React Admin Dashboard
                </h2>
                <p className="text-gray-600">
                    Manage your application with ease
                </p>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {dashboardCards.map((card, index) => (
                    <Card
                        key={index}
                        title={card.title}
                        subtitle={card.description}
                        actions={
                            <Button
                                variant={card.buttonColor}
                                onClick={card.onClick}
                            >
                                {card.buttonText}
                            </Button>
                        }
                    >
                        <div></div>
                    </Card>
                ))}
            </div>

            {/* Stats Section */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Statistics</h3>
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <Card key={i}>
                                <Loading size="sm" text="" />
                            </Card>
                        ))}
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <p className="text-red-800">{error}</p>
                        <Button
                            variant="secondary"
                            onClick={loadDashboardStats}
                            className="mt-2"
                        >
                            Retry
                        </Button>
                    </div>
                ) : stats ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card>
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <UsersIcon className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <UserGroupIcon className="h-8 w-8 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Customers</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stats.totalCustomers}</p>
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <TruckIcon className="h-8 w-8 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Carriers</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stats.totalCarriers}</p>
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    {stats.systemHealth.status === 'healthy' ? (
                                        <CheckCircleIcon className="h-8 w-8 text-green-600" />
                                    ) : stats.systemHealth.status === 'warning' ? (
                                        <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
                                    ) : (
                                        <XCircleIcon className="h-8 w-8 text-red-600" />
                                    )}
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">System Status</p>
                                    <p className="text-2xl font-semibold text-gray-900 capitalize">{stats.systemHealth.status}</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                        <p className="text-yellow-800">No statistics available. This might be due to API connectivity issues.</p>
                        <Button
                            variant="secondary"
                            onClick={loadDashboardStats}
                            className="mt-2"
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
    );
};

export default Dashboard;
