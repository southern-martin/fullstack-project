import {
    ChartBarIcon,
    CurrencyDollarIcon,
    DocumentTextIcon,
    EyeIcon,
    TruckIcon,
    UserGroupIcon,
    UsersIcon
} from '@heroicons/react/24/outline';
import React, { useCallback, useEffect, useState } from 'react';

import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';

interface AnalyticsData {
    totalUsers: number;
    totalCustomers: number;
    totalCarriers: number;
    totalOrders: number;
    totalRevenue: number;
    activeUsers: number;
    activeCustomers: number;
    activeCarriers: number;
}

interface RecentActivity {
    id: number;
    type: 'user' | 'customer' | 'carrier' | 'order';
    action: string;
    description: string;
    timestamp: string;
    user: string;
}

const Analytics: React.FC = () => {
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
        totalUsers: 0,
        totalCustomers: 0,
        totalCarriers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        activeUsers: 0,
        activeCustomers: 0,
        activeCarriers: 0
    });
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('7d');

    // Load analytics data
    const loadAnalyticsData = useCallback(async () => {
        try {
            setLoading(true);
            // Simulate API call - replace with actual API calls
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock data - replace with actual API data
            setAnalyticsData({
                totalUsers: 1247,
                totalCustomers: 3421,
                totalCarriers: 23,
                totalOrders: 15678,
                totalRevenue: 245678.90,
                activeUsers: 892,
                activeCustomers: 2103,
                activeCarriers: 18
            });

            setRecentActivity([
                {
                    id: 1,
                    type: 'user',
                    action: 'created',
                    description: 'New user registered',
                    timestamp: '2025-10-03T10:30:00Z',
                    user: 'John Doe'
                },
                {
                    id: 2,
                    type: 'customer',
                    action: 'updated',
                    description: 'Customer profile updated',
                    timestamp: '2025-10-03T09:15:00Z',
                    user: 'Jane Smith'
                },
                {
                    id: 3,
                    type: 'carrier',
                    action: 'activated',
                    description: 'Carrier activated',
                    timestamp: '2025-10-03T08:45:00Z',
                    user: 'Admin User'
                },
                {
                    id: 4,
                    type: 'order',
                    action: 'completed',
                    description: 'Order completed',
                    timestamp: '2025-10-03T07:20:00Z',
                    user: 'System'
                }
            ]);
        } catch (error) {
            // Handle error silently or show toast notification
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAnalyticsData();
    }, [loadAnalyticsData]);

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'user':
                return <UsersIcon className="h-4 w-4" />;
            case 'customer':
                return <UserGroupIcon className="h-4 w-4" />;
            case 'carrier':
                return <TruckIcon className="h-4 w-4" />;
            case 'order':
                return <DocumentTextIcon className="h-4 w-4" />;
            default:
                return <EyeIcon className="h-4 w-4" />;
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'user':
                return 'text-blue-600 bg-blue-100';
            case 'customer':
                return 'text-green-600 bg-green-100';
            case 'carrier':
                return 'text-purple-600 bg-purple-100';
            case 'order':
                return 'text-orange-600 bg-orange-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div>
            {/* Page Header */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{'Analytics'}</h1>
                    <p className="text-sm text-gray-600">{'Monitor system performance and user activity'}</p>
                </div>
                <div className="flex items-center gap-4">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="1d">{'Last 24 hours'}</option>
                        <option value="7d">{'Last 7 days'}</option>
                        <option value="30d">{'Last 30 days'}</option>
                        <option value="90d">{'Last 90 days'}</option>
                    </select>
                    <Button variant="secondary" className="flex items-center gap-2">
                        <DocumentTextIcon className="h-4 w-4" />
                        {'Export Report'}
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <UsersIcon className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">{'Total Users'}</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {loading ? '...' : analyticsData.totalUsers.toLocaleString()}
                                </p>
                                <p className="text-sm text-green-600">
                                    {'Active'}: {loading ? '...' : analyticsData.activeUsers.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <UserGroupIcon className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">{'Total Customers'}</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {loading ? '...' : analyticsData.totalCustomers.toLocaleString()}
                                </p>
                                <p className="text-sm text-green-600">
                                    {'Active'}: {loading ? '...' : analyticsData.activeCustomers.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <TruckIcon className="h-8 w-8 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">{'Total Carriers'}</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {loading ? '...' : analyticsData.totalCarriers.toLocaleString()}
                                </p>
                                <p className="text-sm text-green-600">
                                    {'Active'}: {loading ? '...' : analyticsData.activeCarriers.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <CurrencyDollarIcon className="h-8 w-8 text-orange-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">{'Total Revenue'}</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {loading ? '...' : `$${analyticsData.totalRevenue.toLocaleString()}`}
                                </p>
                                <p className="text-sm text-green-600">
                                    {'Orders'}: {loading ? '...' : analyticsData.totalOrders.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Charts Section */}
                <Card>
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <ChartBarIcon className="h-5 w-5 mr-2" />
                            {'Performance Overview'}
                        </h3>
                        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                            <div className="text-center">
                                <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500">{'Charts will be implemented here'}</p>
                                <p className="text-sm text-gray-400">{'Integration with charting library needed'}</p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <EyeIcon className="h-5 w-5 mr-2" />
                            {'Recent Activity'}
                        </h3>
                        <div className="space-y-4">
                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="text-gray-500 mt-2">{'Loading activity...'}</p>
                                </div>
                            ) : recentActivity.length > 0 ? (
                                recentActivity.map((activity) => (
                                    <div key={activity.id} className="flex items-start space-x-3">
                                        <div className={`flex-shrink-0 p-2 rounded-full ${getActivityColor(activity.type)}`}>
                                            {getActivityIcon(activity.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">
                                                {activity.description}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {'by'} {activity.user} • {new Date(activity.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <EyeIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-500">{'No recent activity'}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Analytics;
