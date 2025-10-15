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
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

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

    // Chart data
    const performanceData = [
        { name: 'Jan', users: 400, customers: 240, orders: 1200, revenue: 24000 },
        { name: 'Feb', users: 300, customers: 139, orders: 980, revenue: 22100 },
        { name: 'Mar', users: 200, customers: 980, orders: 1100, revenue: 22900 },
        { name: 'Apr', users: 278, customers: 390, orders: 1300, revenue: 20000 },
        { name: 'May', users: 189, customers: 480, orders: 1400, revenue: 21800 },
        { name: 'Jun', users: 239, customers: 380, orders: 1500, revenue: 25000 },
        { name: 'Jul', users: 349, customers: 430, orders: 1600, revenue: 28000 },
    ];

    const userGrowthData = [
        { name: 'Week 1', users: 120, customers: 80, carriers: 5 },
        { name: 'Week 2', users: 190, customers: 120, carriers: 8 },
        { name: 'Week 3', users: 300, customers: 200, carriers: 12 },
        { name: 'Week 4', users: 500, customers: 350, carriers: 18 },
    ];

    const activityDistribution = [
        { name: 'Users', value: 35, color: '#3B82F6' },
        { name: 'Customers', value: 45, color: '#10B981' },
        { name: 'Carriers', value: 15, color: '#8B5CF6' },
        { name: 'Orders', value: 5, color: '#F59E0B' },
    ];

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

            {/* Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Performance Overview Chart */}
                <Card>
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <ChartBarIcon className="h-5 w-5 mr-2" />
                            Performance Overview
                        </h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={performanceData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value, name) => [
                                            typeof value === 'number' ? value.toLocaleString() : value,
                                            name === 'revenue' ? 'Revenue ($)' : name
                                        ]}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="users"
                                        stackId="1"
                                        stroke="#3B82F6"
                                        fill="#3B82F6"
                                        fillOpacity={0.6}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="customers"
                                        stackId="1"
                                        stroke="#10B981"
                                        fill="#10B981"
                                        fillOpacity={0.6}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Card>

                {/* Activity Distribution */}
                <Card>
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <EyeIcon className="h-5 w-5 mr-2" />
                            Activity Distribution
                        </h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={activityDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={120}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {activityDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                            {activityDistribution.map((item, index) => (
                                <div key={index} className="flex items-center">
                                    <div
                                        className="w-3 h-3 rounded-full mr-2"
                                        style={{ backgroundColor: item.color }}
                                    ></div>
                                    <span className="text-sm text-gray-600">{item.name}: {item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Additional Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* User Growth Chart */}
                <Card>
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <UsersIcon className="h-5 w-5 mr-2" />
                            User Growth Trend
                        </h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={userGrowthData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [value.toLocaleString(), 'Count']} />
                                    <Line
                                        type="monotone"
                                        dataKey="users"
                                        stroke="#3B82F6"
                                        strokeWidth={3}
                                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="customers"
                                        stroke="#10B981"
                                        strokeWidth={3}
                                        dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="carriers"
                                        stroke="#8B5CF6"
                                        strokeWidth={3}
                                        dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Card>

                {/* Revenue Chart */}
                <Card>
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                            Revenue & Orders
                        </h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={performanceData}>
                                    <XAxis dataKey="name" />
                                    <YAxis yAxisId="left" />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <Tooltip
                                        formatter={(value, name) => [
                                            name === 'revenue' ? `$${value.toLocaleString()}` : value.toLocaleString(),
                                            name === 'revenue' ? 'Revenue' : 'Orders'
                                        ]}
                                    />
                                    <Bar
                                        yAxisId="left"
                                        dataKey="orders"
                                        fill="#F59E0B"
                                        radius={[4, 4, 0, 0]}
                                    />
                                    <Bar
                                        yAxisId="right"
                                        dataKey="revenue"
                                        fill="#10B981"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

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
