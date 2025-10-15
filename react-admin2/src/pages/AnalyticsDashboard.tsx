import {
    ArrowDownIcon,
    ArrowUpIcon,
    ChartBarIcon,
    ComputerDesktopIcon,
    DevicePhoneMobileIcon,
    EyeIcon,
    GlobeAltIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { DoughnutChart, LineChart } from '../components/Charts';

const AnalyticsDashboard: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('30days');

    const analyticsStats = [
        {
            name: 'Total Visitors',
            value: '2,847,392',
            change: '+12.5%',
            changeType: 'increase',
            icon: EyeIcon,
            color: 'blue',
        },
        {
            name: 'Unique Visitors',
            value: '1,923,847',
            change: '+8.2%',
            changeType: 'increase',
            icon: UserGroupIcon,
            color: 'green',
        },
        {
            name: 'Page Views',
            value: '8,429,847',
            change: '+15.3%',
            changeType: 'increase',
            icon: ChartBarIcon,
            color: 'purple',
        },
        {
            name: 'Bounce Rate',
            value: '34.2%',
            change: '-2.1%',
            changeType: 'decrease',
            icon: ArrowDownIcon,
            color: 'red',
        },
    ];

    const trafficSourcesData = {
        labels: ['Direct', 'Organic Search', 'Social Media', 'Email', 'Referral'],
        datasets: [
            {
                label: 'Traffic Sources',
                data: [45, 30, 15, 7, 3],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                ],
                borderColor: [
                    'rgb(59, 130, 246)',
                    'rgb(34, 197, 94)',
                    'rgb(251, 191, 36)',
                    'rgb(239, 68, 68)',
                    'rgb(139, 92, 246)',
                ],
                borderWidth: 2,
            },
        ],
    };

    const pageViewsData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Page Views',
                data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 32000, 40000, 38000, 45000],
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const deviceData = {
        labels: ['Desktop', 'Mobile', 'Tablet'],
        datasets: [
            {
                label: 'Device Usage',
                data: [65, 30, 5],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                ],
                borderColor: [
                    'rgb(59, 130, 246)',
                    'rgb(34, 197, 94)',
                    'rgb(251, 191, 36)',
                ],
                borderWidth: 2,
            },
        ],
    };

    const topPages = [
        { page: '/dashboard', views: 125430, visitors: 89420, bounceRate: '23.4%' },
        { page: '/products', views: 98750, visitors: 65430, bounceRate: '31.2%' },
        { page: '/about', views: 76540, visitors: 54320, bounceRate: '28.7%' },
        { page: '/contact', views: 54320, visitors: 43210, bounceRate: '35.1%' },
        { page: '/blog', views: 43210, visitors: 32100, bounceRate: '42.3%' },
    ];

    const getColorClasses = (color: string) => {
        const colors = {
            blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
            green: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
            purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
            red: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
        };
        return colors[color as keyof typeof colors] || colors.blue;
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Analytics Dashboard</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Website traffic and user behavior analytics</p>
                </div>

                <div className="flex items-center space-x-2">
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                        <option value="7days">Last 7 days</option>
                        <option value="30days">Last 30 days</option>
                        <option value="90days">Last 90 days</option>
                        <option value="1year">Last year</option>
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {analyticsStats.map((stat) => (
                    <div key={stat.name} className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${getColorClasses(stat.color)}`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                                <div className="flex items-center">
                                    {stat.changeType === 'increase' ? (
                                        <ArrowUpIcon className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <ArrowDownIcon className="h-4 w-4 text-red-500" />
                                    )}
                                    <span className={`ml-1 text-sm font-medium ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {stat.change}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Page Views Chart */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Page Views Over Time</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Monthly page view trends</p>
                    </div>
                    <div className="h-80">
                        <LineChart data={pageViewsData} />
                    </div>
                </div>

                {/* Traffic Sources */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Traffic Sources</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Where your visitors come from</p>
                    </div>
                    <div className="h-80">
                        <DoughnutChart data={trafficSourcesData} />
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Device Usage */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Device Usage</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Traffic by device type</p>
                    </div>
                    <div className="h-64">
                        <DoughnutChart data={deviceData} />
                    </div>
                </div>

                {/* Top Pages */}
                <div className="lg:col-span-2 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Top Pages</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Most visited pages</p>
                    </div>
                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Page
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Views
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Visitors
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Bounce Rate
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                                {topPages.map((page, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            {page.page}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {page.views.toLocaleString()}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {page.visitors.toLocaleString()}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {page.bounceRate}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Real-time Stats */}
            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Real-time Activity</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                            <EyeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">1,247</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                            <ComputerDesktopIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Desktop</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">892</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                            <DevicePhoneMobileIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Mobile</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">355</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                            <GlobeAltIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Countries</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">47</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
