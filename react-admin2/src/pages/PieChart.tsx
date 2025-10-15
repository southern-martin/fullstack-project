import {
    ArcElement,
    Chart as ChartJS,
    Legend,
    Tooltip,
} from 'chart.js';
import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart: React.FC = () => {
    const [selectedChart, setSelectedChart] = useState('sales');

    const salesData = {
        labels: ['Desktop', 'Mobile', 'Tablet', 'Other'],
        datasets: [
            {
                data: [45, 30, 15, 10],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                ],
                borderColor: [
                    'rgb(59, 130, 246)',
                    'rgb(34, 197, 94)',
                    'rgb(251, 191, 36)',
                    'rgb(239, 68, 68)',
                ],
                borderWidth: 2,
                hoverOffset: 4,
            },
        ],
    };

    const revenueData = {
        labels: ['Product Sales', 'Services', 'Subscriptions', 'Consulting', 'Support'],
        datasets: [
            {
                data: [40, 25, 20, 10, 5],
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
                hoverOffset: 4,
            },
        ],
    };

    const customerData = {
        labels: ['New Customers', 'Returning Customers', 'VIP Customers', 'Inactive Customers'],
        datasets: [
            {
                data: [35, 40, 15, 10],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(156, 163, 175, 0.8)',
                ],
                borderColor: [
                    'rgb(59, 130, 246)',
                    'rgb(34, 197, 94)',
                    'rgb(251, 191, 36)',
                    'rgb(156, 163, 175)',
                ],
                borderWidth: 2,
                hoverOffset: 4,
            },
        ],
    };

    const getCurrentData = () => {
        switch (selectedChart) {
            case 'sales':
                return salesData;
            case 'revenue':
                return revenueData;
            case 'customers':
                return customerData;
            default:
                return salesData;
        }
    };

    const getChartTitle = () => {
        switch (selectedChart) {
            case 'sales':
                return 'Sales by Device Type';
            case 'revenue':
                return 'Revenue by Category';
            case 'customers':
                return 'Customer Distribution';
            default:
                return 'Sales by Device Type';
        }
    };

    const getChartDescription = () => {
        switch (selectedChart) {
            case 'sales':
                return 'Distribution of sales across different device types';
            case 'revenue':
                return 'Revenue breakdown by business category';
            case 'customers':
                return 'Customer base distribution and segmentation';
            default:
                return 'Distribution of sales across different device types';
        }
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 12,
                        weight: 'normal' as const,
                    },
                },
            },
            title: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: true,
                callbacks: {
                    label: function (context: any) {
                        const label = context.label || '';
                        const value = context.parsed;
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} (${percentage}%)`;
                    },
                },
            },
        },
        elements: {
            arc: {
                borderWidth: 2,
            },
        },
    };

    const doughnutOptions = {
        ...options,
        cutout: '60%',
        plugins: {
            ...options.plugins,
            legend: {
                ...options.plugins.legend,
                position: 'right' as const,
            },
        },
    };

    const getChartStats = () => {
        const data = getCurrentData();
        const total = data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
        const maxValue = Math.max(...data.datasets[0].data);
        const maxIndex = data.datasets[0].data.indexOf(maxValue);
        const maxLabel = data.labels[maxIndex];

        return { total, maxValue, maxLabel };
    };

    const stats = getChartStats();

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Pie Chart</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Interactive pie and doughnut charts with multiple datasets</p>
                </div>

                <div className="flex items-center space-x-2">
                    <select
                        value={selectedChart}
                        onChange={(e) => setSelectedChart(e.target.value)}
                        className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                        <option value="sales">Sales by Device</option>
                        <option value="revenue">Revenue by Category</option>
                        <option value="customers">Customer Distribution</option>
                    </select>
                </div>
            </div>

            {/* Chart Container */}
            <div className="space-y-6">
                {/* Main Chart */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{getChartTitle()}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{getChartDescription()}</p>
                    </div>
                    <div className="h-80">
                        <Pie data={getCurrentData()} options={options} />
                    </div>
                </div>

                {/* Chart Variants */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Doughnut Chart */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                        <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Doughnut Chart</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Alternative doughnut style with center cutout
                            </p>
                        </div>
                        <div className="h-64">
                            <Pie data={getCurrentData()} options={doughnutOptions} />
                        </div>
                    </div>

                    {/* Half Pie Chart */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                        <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Half Pie Chart</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Semi-circle pie chart for compact display
                            </p>
                        </div>
                        <div className="h-64">
                            <Pie
                                data={getCurrentData()}
                                options={{
                                    ...options,
                                    circumference: 180,
                                    rotation: -90,
                                    plugins: {
                                        ...options.plugins,
                                        legend: {
                                            ...options.plugins.legend,
                                            position: 'bottom' as const,
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Chart Statistics */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                                    <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.total}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                                    <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Highest Value</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.maxValue}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                                    <svg className="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Top Category</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.maxLabel}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chart Features */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Chart Features</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                                    <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Interactive Tooltips</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Hover over segments for detailed information with percentages</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                                    <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Multiple Variants</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Pie, doughnut, and half-pie chart styles</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                                    <svg className="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Customizable Colors</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Full control over colors and styling</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                                    <svg className="h-4 w-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode Support</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Automatic theme adaptation</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                                    <svg className="h-4 w-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Responsive Design</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Adapts to all screen sizes</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/20">
                                    <svg className="h-4 w-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Hover Effects</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Smooth animations and hover interactions</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PieChart;
