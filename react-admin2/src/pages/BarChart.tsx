import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from 'chart.js';
import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const BarChart: React.FC = () => {
    const [selectedChart, setSelectedChart] = useState('vertical');

    const salesData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Sales',
                data: [12, 19, 3, 5, 2, 3, 20, 3, 5, 6, 2, 3],
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false,
            },
            {
                label: 'Revenue',
                data: [65, 59, 80, 81, 56, 55, 40, 30, 45, 50, 70, 85],
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                borderColor: 'rgb(34, 197, 94)',
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false,
            },
        ],
    };

    const categoryData = {
        labels: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty'],
        datasets: [
            {
                label: 'Products Sold',
                data: [45, 32, 28, 19, 15, 12],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                ],
                borderColor: [
                    'rgb(59, 130, 246)',
                    'rgb(34, 197, 94)',
                    'rgb(251, 191, 36)',
                    'rgb(239, 68, 68)',
                    'rgb(139, 92, 246)',
                    'rgb(236, 72, 153)',
                ],
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false,
            },
        ],
    };

    const performanceData = {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
            {
                label: 'Target',
                data: [100, 120, 110, 130],
                backgroundColor: 'rgba(156, 163, 175, 0.8)',
                borderColor: 'rgb(156, 163, 175)',
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false,
            },
            {
                label: 'Actual',
                data: [95, 125, 105, 140],
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false,
            },
        ],
    };

    const getCurrentData = () => {
        switch (selectedChart) {
            case 'vertical':
                return salesData;
            case 'horizontal':
                return {
                    ...salesData,
                    datasets: salesData.datasets.map(dataset => ({
                        ...dataset,
                        // For horizontal bars, we need to modify the data structure
                    }))
                };
            case 'category':
                return categoryData;
            case 'performance':
                return performanceData;
            default:
                return salesData;
        }
    };

    const getChartOptions = () => {
        const baseOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top' as const,
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
                },
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                    },
                    ticks: {
                        font: {
                            size: 11,
                        },
                        color: '#6b7280',
                    },
                },
                y: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false,
                    },
                    ticks: {
                        font: {
                            size: 11,
                        },
                        color: '#6b7280',
                    },
                },
            },
        };

        if (selectedChart === 'horizontal') {
            return {
                ...baseOptions,
                indexAxis: 'y' as const,
                scales: {
                    x: {
                        ...baseOptions.scales.x,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false,
                        },
                    },
                    y: {
                        ...baseOptions.scales.y,
                        grid: {
                            display: false,
                        },
                    },
                },
            };
        }

        return baseOptions;
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Bar Chart</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Interactive bar charts with multiple variants</p>
                </div>

                <div className="flex items-center space-x-2">
                    <select
                        value={selectedChart}
                        onChange={(e) => setSelectedChart(e.target.value)}
                        className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                        <option value="vertical">Vertical Bars</option>
                        <option value="horizontal">Horizontal Bars</option>
                        <option value="category">Category Comparison</option>
                        <option value="performance">Performance vs Target</option>
                    </select>
                </div>
            </div>

            {/* Chart Container */}
            <div className="space-y-6">
                {/* Main Chart */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {selectedChart === 'vertical' && 'Monthly Sales & Revenue'}
                            {selectedChart === 'horizontal' && 'Horizontal Bar Chart'}
                            {selectedChart === 'category' && 'Product Categories Performance'}
                            {selectedChart === 'performance' && 'Quarterly Performance vs Target'}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedChart === 'vertical' && 'Track your monthly business performance'}
                            {selectedChart === 'horizontal' && 'Alternative horizontal bar visualization'}
                            {selectedChart === 'category' && 'Compare performance across different product categories'}
                            {selectedChart === 'performance' && 'Monitor actual performance against set targets'}
                        </p>
                    </div>
                    <div className="h-80">
                        <Bar data={getCurrentData()} options={getChartOptions()} />
                    </div>
                </div>

                {/* Chart Variants */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Stacked Bar Chart */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                        <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Stacked Bar Chart</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Stacked data visualization for better comparison
                            </p>
                        </div>
                        <div className="h-64">
                            <Bar
                                data={{
                                    ...salesData,
                                    datasets: salesData.datasets.map(dataset => ({
                                        ...dataset,
                                        // Stacked configuration
                                    }))
                                }}
                                options={{
                                    ...getChartOptions(),
                                    scales: {
                                        ...getChartOptions().scales,
                                        x: {
                                            ...getChartOptions().scales.x,
                                            stacked: true,
                                        },
                                        y: {
                                            ...getChartOptions().scales.y,
                                            stacked: true,
                                        },
                                    },
                                    plugins: {
                                        ...getChartOptions().plugins,
                                        legend: {
                                            display: false,
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>

                    {/* Grouped Bar Chart */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                        <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Grouped Bar Chart</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Side-by-side comparison of multiple datasets
                            </p>
                        </div>
                        <div className="h-64">
                            <Bar
                                data={salesData}
                                options={{
                                    ...getChartOptions(),
                                    plugins: {
                                        ...getChartOptions().plugins,
                                        legend: {
                                            display: false,
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Chart Statistics */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sales</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">$125,430</p>
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
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Growth Rate</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">+12.5%</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                                    <svg className="h-4 w-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Order Value</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">$89.50</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                                    <svg className="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">1,402</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BarChart;
