import {
    ArrowDownIcon,
    ArrowUpIcon,
    ChartBarIcon,
    ChatBubbleLeftRightIcon,
    EnvelopeIcon,
    HeartIcon,
    MegaphoneIcon,
    ShareIcon,
    ShoppingCartIcon
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { DoughnutChart, LineChart } from '../components/Charts';

const MarketingDashboard: React.FC = () => {
    const [selectedCampaign, setSelectedCampaign] = useState('all');

    const marketingStats = [
        {
            name: 'Total Campaigns',
            value: '24',
            change: '+3',
            changeType: 'increase',
            icon: MegaphoneIcon,
            color: 'blue',
        },
        {
            name: 'Email Opens',
            value: '89,432',
            change: '+12.5%',
            changeType: 'increase',
            icon: EnvelopeIcon,
            color: 'green',
        },
        {
            name: 'Click Rate',
            value: '4.2%',
            change: '+0.8%',
            changeType: 'increase',
            icon: ChartBarIcon,
            color: 'purple',
        },
        {
            name: 'Conversion Rate',
            value: '2.8%',
            change: '-0.3%',
            changeType: 'decrease',
            icon: ShoppingCartIcon,
            color: 'red',
        },
    ];

    const campaignPerformanceData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Email Campaigns',
                data: [1200, 1900, 1500, 2500, 2200, 3000, 2800, 3500, 3200, 4000, 3800, 4500],
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Social Media',
                data: [800, 1200, 1000, 1800, 1600, 2200, 2000, 2500, 2300, 2800, 2600, 3000],
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const channelData = {
        labels: ['Email', 'Social Media', 'Paid Ads', 'Content', 'SEO'],
        datasets: [
            {
                label: 'Channel Performance',
                data: [35, 25, 20, 12, 8],
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

    const socialMediaData = {
        labels: ['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'YouTube'],
        datasets: [
            {
                label: 'Engagement',
                data: [45, 30, 15, 7, 3],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(29, 161, 242, 0.8)',
                    'rgba(0, 119, 181, 0.8)',
                    'rgba(255, 0, 0, 0.8)',
                ],
                borderColor: [
                    'rgb(59, 130, 246)',
                    'rgb(236, 72, 153)',
                    'rgb(29, 161, 242)',
                    'rgb(0, 119, 181)',
                    'rgb(255, 0, 0)',
                ],
                borderWidth: 2,
            },
        ],
    };

    const campaigns = [
        { name: 'Summer Sale 2024', type: 'Email', sent: 50000, opened: 15000, clicked: 3200, converted: 450, status: 'active' },
        { name: 'New Product Launch', type: 'Social', sent: 25000, opened: 8500, clicked: 1800, converted: 280, status: 'active' },
        { name: 'Black Friday', type: 'Email', sent: 75000, opened: 22000, clicked: 4800, converted: 720, status: 'completed' },
        { name: 'Holiday Campaign', type: 'Paid Ads', sent: 100000, opened: 35000, clicked: 7500, converted: 1200, status: 'active' },
        { name: 'Welcome Series', type: 'Email', sent: 15000, opened: 12000, clicked: 3600, converted: 540, status: 'active' },
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
            active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
            completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
            paused: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
        };

        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClasses[status as keyof typeof statusClasses]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Marketing Dashboard</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Campaign performance and marketing analytics</p>
                </div>

                <div className="flex items-center space-x-2">
                    <select
                        value={selectedCampaign}
                        onChange={(e) => setSelectedCampaign(e.target.value)}
                        className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                        <option value="all">All Campaigns</option>
                        <option value="email">Email Campaigns</option>
                        <option value="social">Social Media</option>
                        <option value="paid">Paid Ads</option>
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {marketingStats.map((stat) => (
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
                {/* Campaign Performance */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Campaign Performance</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Monthly campaign reach and engagement</p>
                    </div>
                    <div className="h-80">
                        <LineChart data={campaignPerformanceData} />
                    </div>
                </div>

                {/* Channel Performance */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Channel Performance</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Marketing channel distribution</p>
                    </div>
                    <div className="h-80">
                        <DoughnutChart data={channelData} />
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Social Media Engagement */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Social Media</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Platform engagement rates</p>
                    </div>
                    <div className="h-64">
                        <DoughnutChart data={socialMediaData} />
                    </div>
                </div>

                {/* Campaign List */}
                <div className="lg:col-span-2 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Active Campaigns</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Current marketing campaigns</p>
                    </div>
                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Campaign
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Sent
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Open Rate
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                                {campaigns.map((campaign, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            {campaign.name}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {campaign.type}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {campaign.sent.toLocaleString()}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {((campaign.opened / campaign.sent) * 100).toFixed(1)}%
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            {getStatusBadge(campaign.status)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Marketing Insights */}
            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Marketing Insights</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                            <EnvelopeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email ROI</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">$4.20</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                            <ShareIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Social Shares</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">2,847</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                            <HeartIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Engagement</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">8.4%</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                            <ChatBubbleLeftRightIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Comments</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">1,234</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketingDashboard;
