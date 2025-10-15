import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const LineChart: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('12months');

    const monthlySalesData = {
        labels: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
        datasets: [
            {
                label: 'Sales',
                data: [12, 19, 3, 5, 2, 3, 20, 3, 5, 6, 2, 3],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
            },
            {
                label: 'Revenue',
                data: [65, 59, 80, 81, 56, 55, 40, 30, 45, 50, 70, 85],
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgb(34, 197, 94)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
            },
        ],
    };

    const quarterlyData = {
        labels: ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023'],
        datasets: [
            {
                label: 'Sales',
                data: [45, 67, 89, 78],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
            },
            {
                label: 'Revenue',
                data: [120, 150, 180, 200],
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgb(34, 197, 94)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
            },
        ],
    };

    const weeklyData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
            {
                label: 'Sales',
                data: [8, 12, 6, 15],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
            },
            {
                label: 'Revenue',
                data: [25, 35, 20, 45],
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgb(34, 197, 94)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
            },
        ],
    };

    const getCurrentData = () => {
        switch (selectedPeriod) {
            case '12months':
                return monthlySalesData;
            case 'quarterly':
                return quarterlyData;
            case 'weekly':
                return weeklyData;
            default:
                return monthlySalesData;
        }
    };

    const options = {
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
                intersect: false,
                mode: 'index' as const,
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
        interaction: {
            intersect: false,
            mode: 'index' as const,
        },
        elements: {
            point: {
                hoverBackgroundColor: '#fff',
            },
        },
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Line Chart</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Interactive line charts with multiple datasets</p>
                </div>

                <div className="flex items-center space-x-2">
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                        <option value="12months">Last 12 Months</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="weekly">Weekly</option>
                    </select>
                </div>
            </div>

            {/* Chart Container */}
            <div className="space-y-6">
                {/* Main Chart */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sales & Revenue Trends</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Track your business performance over time
                        </p>
                    </div>
                    <div className="h-80">
                        <Line data={getCurrentData()} options={options} />
                    </div>
                </div>

                {/* Chart Variants */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Smooth Line Chart */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                        <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Smooth Line Chart</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Curved lines for better visualization
                            </p>
                        </div>
                        <div className="h-64">
                            <Line
                                data={{
                                    ...getCurrentData(),
                                    datasets: getCurrentData().datasets.map(dataset => ({
                                        ...dataset,
                                        tension: 0.6,
                                        borderWidth: 2,
                                    }))
                                }}
                                options={{
                                    ...options,
                                    plugins: {
                                        ...options.plugins,
                                        legend: {
                                            display: false,
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>

                    {/* Stepped Line Chart */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                        <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Stepped Line Chart</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Step-by-step progression visualization
                            </p>
                        </div>
                        <div className="h-64">
                            <Line
                                data={{
                                    ...getCurrentData(),
                                    datasets: getCurrentData().datasets.map(dataset => ({
                                        ...dataset,
                                        stepped: true,
                                        borderWidth: 2,
                                    }))
                                }}
                                options={{
                                    ...options,
                                    plugins: {
                                        ...options.plugins,
                                        legend: {
                                            display: false,
                                        },
                                    },
                                }}
                            />
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
                                <p className="text-sm text-gray-600 dark:text-gray-400">Hover over data points for detailed information</p>
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
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Smooth Animations</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Fluid transitions and hover effects</p>
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
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Multiple Datasets</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Compare multiple data series simultaneously</p>
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
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Customizable</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Fully customizable colors and styles</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LineChart;
