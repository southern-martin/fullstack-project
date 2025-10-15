import {
    ArrowDownIcon,
    ArrowUpIcon,
    ChartBarIcon,
    CloudIcon,
    CpuChipIcon,
    CurrencyDollarIcon,
    ServerIcon,
    ShieldCheckIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { DoughnutChart, LineChart } from '../components/Charts';

const SaaSDashboard: React.FC = () => {
    const [selectedMetric, setSelectedMetric] = useState('revenue');

    const saasStats = [
        {
            name: 'Monthly Recurring Revenue',
            value: '$89,432',
            change: '+12.5%',
            changeType: 'increase',
            icon: CurrencyDollarIcon,
            color: 'green',
        },
        {
            name: 'Active Users',
            value: '12,847',
            change: '+8.2%',
            changeType: 'increase',
            icon: UserGroupIcon,
            color: 'blue',
        },
        {
            name: 'Churn Rate',
            value: '2.4%',
            change: '-0.3%',
            changeType: 'decrease',
            icon: ArrowDownIcon,
            color: 'green',
        },
        {
            name: 'Customer Lifetime Value',
            value: '$2,847',
            change: '+15.3%',
            changeType: 'increase',
            icon: ChartBarIcon,
            color: 'purple',
        },
    ];

    const revenueData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'MRR',
                data: [65000, 68000, 72000, 75000, 78000, 82000, 85000, 87000, 89000, 92000, 95000, 98000],
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const userGrowthData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'New Users',
                data: [1200, 1500, 1800, 2200, 2500, 2800, 3200, 3500, 3800, 4200, 4500, 4800],
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Churned Users',
                data: [200, 250, 300, 280, 320, 350, 380, 400, 420, 450, 480, 500],
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const planDistributionData = {
        labels: ['Basic', 'Pro', 'Enterprise', 'Custom'],
        datasets: [
            {
                label: 'Plan Distribution',
                data: [45, 35, 15, 5],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                ],
                borderColor: [
                    'rgb(59, 130, 246)',
                    'rgb(34, 197, 94)',
                    'rgb(251, 191, 36)',
                    'rgb(139, 92, 246)',
                ],
                borderWidth: 2,
            },
        ],
    };

    const recentSignups = [
        { name: 'John Smith', email: 'john@company.com', plan: 'Pro', signupDate: '2024-01-15', status: 'Active' },
        { name: 'Sarah Johnson', email: 'sarah@startup.io', plan: 'Basic', signupDate: '2024-01-14', status: 'Active' },
        { name: 'Mike Chen', email: 'mike@enterprise.com', plan: 'Enterprise', signupDate: '2024-01-13', status: 'Active' },
        { name: 'Emily Davis', email: 'emily@agency.com', plan: 'Pro', signupDate: '2024-01-12', status: 'Trial' },
        { name: 'David Wilson', email: 'david@consulting.com', plan: 'Basic', signupDate: '2024-01-11', status: 'Active' },
    ];

    const systemMetrics = [
        { name: 'API Response Time', value: '145ms', status: 'good', icon: ServerIcon },
        { name: 'Uptime', value: '99.9%', status: 'excellent', icon: CloudIcon },
        { name: 'Security Score', value: 'A+', status: 'excellent', icon: ShieldCheckIcon },
        { name: 'Server Load', value: '23%', status: 'good', icon: CpuChipIcon },
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

    const getStatusBadge = (status: string) => {
        const statusClasses = {
            'Active': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
            'Trial': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
            'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
            'Suspended': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
        };

        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClasses[status as keyof typeof statusClasses]}`}>
                {status}
            </span>
        );
    };

    const getMetricStatusColor = (status: string) => {
        const statusColors = {
            excellent: 'text-green-600 dark:text-green-400',
            good: 'text-blue-600 dark:text-blue-400',
            warning: 'text-yellow-600 dark:text-yellow-400',
            critical: 'text-red-600 dark:text-red-400',
        };
        return statusColors[status as keyof typeof statusColors] || statusColors.good;
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">SaaS Dashboard</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Software as a Service metrics and analytics</p>
                </div>

                <div className="flex items-center space-x-2">
                    <select
                        value={selectedMetric}
                        onChange={(e) => setSelectedMetric(e.target.value)}
                        className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                        <option value="revenue">Revenue</option>
                        <option value="users">Users</option>
                        <option value="churn">Churn</option>
                        <option value="growth">Growth</option>
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {saasStats.map((stat) => (
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
                {/* Revenue Growth */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Monthly Recurring Revenue</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">MRR growth over the last 12 months</p>
                    </div>
                    <div className="h-80">
                        <LineChart data={revenueData} />
                    </div>
                </div>

                {/* User Growth vs Churn */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">User Growth vs Churn</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">New users vs churned users</p>
                    </div>
                    <div className="h-80">
                        <LineChart data={userGrowthData} />
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Plan Distribution */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Plan Distribution</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Customer distribution by plan</p>
                    </div>
                    <div className="h-64">
                        <DoughnutChart data={planDistributionData} />
                    </div>
                </div>

                {/* Recent Signups */}
                <div className="lg:col-span-2 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Signups</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Latest customer registrations</p>
                    </div>
                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Plan
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Signup Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                                {recentSignups.map((signup, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{signup.name}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{signup.email}</div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {signup.plan}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {signup.signupDate}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            {getStatusBadge(signup.status)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* System Health */}
            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">System Health</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {systemMetrics.map((metric, index) => (
                        <div key={index} className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                <metric.icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{metric.name}</p>
                                <p className={`text-lg font-semibold ${getMetricStatusColor(metric.status)}`}>
                                    {metric.value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SaaSDashboard;
