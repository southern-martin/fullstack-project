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
import React, { useEffect, useRef } from 'react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Title,
    Tooltip,
    Legend
);

const AreaChart: React.FC = () => {
    const chartRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                new ChartJS(ctx, {
                    type: 'line',
                    data: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                        datasets: [
                            {
                                label: 'Sales',
                                data: [12, 19, 3, 5, 2, 3, 20, 3, 5, 6, 2, 3],
                                borderColor: 'rgb(59, 130, 246)',
                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                fill: true,
                                tension: 0.4,
                            },
                            {
                                label: 'Revenue',
                                data: [2, 3, 20, 5, 1, 4, 5, 6, 7, 8, 9, 10],
                                borderColor: 'rgb(16, 185, 129)',
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                fill: true,
                                tension: 0.4,
                            },
                            {
                                label: 'Profit',
                                data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                                borderColor: 'rgb(245, 158, 11)',
                                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                fill: true,
                                tension: 0.4,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'top' as const,
                            },
                            title: {
                                display: true,
                                text: 'Area Chart - Monthly Performance',
                            },
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                            },
                        },
                    },
                });
            }
        }
    }, []);

    return (
        <div className="mx-auto max-w-7xl p-6">
            <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">Area Chart</h1>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Basic Area Chart */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Basic Area Chart</h2>
                    <div className="h-80">
                        <canvas ref={chartRef}></canvas>
                    </div>
                </div>

                {/* Stacked Area Chart */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Stacked Area Chart</h2>
                    <div className="h-80">
                        <canvas id="stackedAreaChart"></canvas>
                    </div>
                </div>

                {/* Gradient Area Chart */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Gradient Area Chart</h2>
                    <div className="h-80">
                        <canvas id="gradientAreaChart"></canvas>
                    </div>
                </div>

                {/* Multi-Series Area Chart */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Multi-Series Area Chart</h2>
                    <div className="h-80">
                        <canvas id="multiSeriesAreaChart"></canvas>
                    </div>
                </div>
            </div>

            {/* Chart Configuration */}
            <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Chart Configuration</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">Features</h3>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li className="flex items-center space-x-2">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <span>Responsive design</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <span>Interactive tooltips</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <span>Customizable colors</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <span>Multiple datasets</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <span>Gradient fills</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">Usage</h3>
                        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                            <pre className="text-xs text-gray-800 dark:text-gray-200">
                                {`import { Chart } from 'chart.js';

const chart = new Chart(ctx, {
  type: 'line',
  data: {
    datasets: [{
      fill: true,
      tension: 0.4,
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: 'rgb(59, 130, 246)'
    }]
  }
});`}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AreaChart;
