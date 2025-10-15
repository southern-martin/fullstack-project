import {
    ArrowDownIcon,
    ArrowUpIcon,
    CalendarIcon,
    ChartBarIcon,
    CheckCircleIcon,
    CurrencyDollarIcon,
    EnvelopeIcon,
    PhoneIcon,
    UserGroupIcon,
    UserPlusIcon
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { DoughnutChart, LineChart } from '../components/Charts';

const CRMDashboard: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('30days');

    const crmStats = [
        {
            name: 'Total Leads',
            value: '2,847',
            change: '+12.5%',
            changeType: 'increase',
            icon: UserGroupIcon,
            color: 'blue',
        },
        {
            name: 'New Customers',
            value: '1,234',
            change: '+8.2%',
            changeType: 'increase',
            icon: UserPlusIcon,
            color: 'green',
        },
        {
            name: 'Revenue',
            value: '$89,432',
            change: '+15.3%',
            changeType: 'increase',
            icon: CurrencyDollarIcon,
            color: 'purple',
        },
        {
            name: 'Conversion Rate',
            value: '24.2%',
            change: '-2.1%',
            changeType: 'decrease',
            icon: ChartBarIcon,
            color: 'red',
        },
    ];

    const leadSourceData = {
        labels: ['Website', 'Referral', 'Social Media', 'Email', 'Phone', 'Other'],
        datasets: [
            {
                label: 'Lead Sources',
                data: [35, 25, 20, 12, 5, 3],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(156, 163, 175, 0.8)',
                ],
                borderColor: [
                    'rgb(59, 130, 246)',
                    'rgb(34, 197, 94)',
                    'rgb(251, 191, 36)',
                    'rgb(239, 68, 68)',
                    'rgb(139, 92, 246)',
                    'rgb(156, 163, 175)',
                ],
                borderWidth: 2,
            },
        ],
    };

    const salesPipelineData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Leads',
                data: [120, 190, 150, 250, 220, 300, 280, 350, 320, 400, 380, 450],
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Customers',
                data: [80, 120, 100, 180, 160, 220, 200, 250, 230, 280, 260, 300],
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const dealStageData = {
        labels: ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'],
        datasets: [
            {
                label: 'Deals by Stage',
                data: [45, 30, 25, 15, 8, 5],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(156, 163, 175, 0.8)',
                ],
                borderColor: [
                    'rgb(59, 130, 246)',
                    'rgb(34, 197, 94)',
                    'rgb(251, 191, 36)',
                    'rgb(239, 68, 68)',
                    'rgb(139, 92, 246)',
                    'rgb(156, 163, 175)',
                ],
                borderWidth: 2,
            },
        ],
    };

    const recentLeads = [
        { name: 'John Smith', company: 'Tech Corp', email: 'john@techcorp.com', phone: '+1 (555) 123-4567', source: 'Website', status: 'New', value: '$5,000' },
        { name: 'Sarah Johnson', company: 'Design Studio', email: 'sarah@designstudio.com', phone: '+1 (555) 234-5678', source: 'Referral', status: 'Contacted', value: '$3,500' },
        { name: 'Mike Chen', company: 'Startup Inc', email: 'mike@startup.com', phone: '+1 (555) 345-6789', source: 'Social Media', status: 'Qualified', value: '$8,000' },
        { name: 'Emily Davis', company: 'Marketing Pro', email: 'emily@marketingpro.com', phone: '+1 (555) 456-7890', source: 'Email', status: 'Proposal', value: '$12,000' },
        { name: 'David Wilson', company: 'Consulting Ltd', email: 'david@consulting.com', phone: '+1 (555) 567-8901', source: 'Phone', status: 'Negotiation', value: '$15,000' },
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
            'New': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
            'Contacted': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
            'Qualified': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
            'Proposal': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
            'Negotiation': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
            'Closed Won': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
            'Closed Lost': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
        };

        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClasses[status as keyof typeof statusClasses]}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">CRM Dashboard</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Customer relationship management and sales pipeline</p>
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
                {crmStats.map((stat) => (
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
                {/* Sales Pipeline */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sales Pipeline</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Leads and customers over time</p>
                    </div>
                    <div className="h-80">
                        <LineChart data={salesPipelineData} />
                    </div>
                </div>

                {/* Lead Sources */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Lead Sources</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Where your leads come from</p>
                    </div>
                    <div className="h-80">
                        <DoughnutChart data={leadSourceData} />
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Deal Stages */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Deal Stages</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Sales pipeline distribution</p>
                    </div>
                    <div className="h-64">
                        <DoughnutChart data={dealStageData} />
                    </div>
                </div>

                {/* Recent Leads */}
                <div className="lg:col-span-2 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Leads</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Latest customer inquiries</p>
                    </div>
                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Company
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Source
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Value
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                                {recentLeads.map((lead, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{lead.email}</div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {lead.company}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {lead.source}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            {getStatusBadge(lead.status)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            {lead.value}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* CRM Activities */}
            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Recent Activities</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                            <PhoneIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Calls Made</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">47</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                            <EnvelopeIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Emails Sent</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">123</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                            <CalendarIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Meetings</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">18</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                            <CheckCircleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tasks Completed</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">89</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CRMDashboard;
