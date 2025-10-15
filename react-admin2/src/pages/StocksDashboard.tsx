import {
    ArrowDownIcon,
    ArrowTrendingUpIcon,
    ArrowUpIcon,
    ChartBarIcon,
    ClockIcon,
    CurrencyDollarIcon,
    EyeIcon,
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { DoughnutChart, LineChart } from '../components/Charts';

const StocksDashboard: React.FC = () => {
    const [selectedTimeframe, setSelectedTimeframe] = useState('1D');

    const portfolioStats = [
        {
            name: 'Total Portfolio Value',
            value: '$125,847.32',
            change: '+$2,847.32',
            changeType: 'increase',
            icon: CurrencyDollarIcon,
            color: 'green',
        },
        {
            name: 'Today\'s Gain/Loss',
            value: '+$1,234.56',
            change: '+2.1%',
            changeType: 'increase',
            icon: ArrowTrendingUpIcon,
            color: 'green',
        },
        {
            name: 'Total Return',
            value: '+$15,432.10',
            change: '+13.9%',
            changeType: 'increase',
            icon: ChartBarIcon,
            color: 'blue',
        },
        {
            name: 'Active Positions',
            value: '24',
            change: '+2',
            changeType: 'increase',
            icon: EyeIcon,
            color: 'purple',
        },
    ];

    const portfolioData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Portfolio Value',
                data: [95000, 98000, 102000, 105000, 108000, 112000, 115000, 118000, 120000, 122000, 124000, 125847],
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const sectorAllocationData = {
        labels: ['Technology', 'Healthcare', 'Finance', 'Consumer', 'Energy', 'Other'],
        datasets: [
            {
                label: 'Sector Allocation',
                data: [35, 20, 15, 12, 10, 8],
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

    const topPerformers = [
        { symbol: 'AAPL', name: 'Apple Inc.', price: '$175.43', change: '+$2.34', changePercent: '+1.35%', volume: '45.2M' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '$142.56', change: '+$1.87', changePercent: '+1.33%', volume: '28.7M' },
        { symbol: 'MSFT', name: 'Microsoft Corp.', price: '$378.85', change: '+$4.12', changePercent: '+1.10%', volume: '32.1M' },
        { symbol: 'TSLA', name: 'Tesla Inc.', price: '$248.50', change: '+$2.15', changePercent: '+0.87%', volume: '89.3M' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', price: '$155.20', change: '+$1.23', changePercent: '+0.80%', volume: '41.8M' },
    ];

    const watchlist = [
        { symbol: 'NVDA', name: 'NVIDIA Corp.', price: '$875.28', change: '-$12.45', changePercent: '-1.40%', marketCap: '$2.15T' },
        { symbol: 'META', name: 'Meta Platforms', price: '$485.20', change: '+$8.90', changePercent: '+1.87%', marketCap: '$1.23T' },
        { symbol: 'NFLX', name: 'Netflix Inc.', price: '$612.45', change: '+$5.67', changePercent: '+0.93%', marketCap: '$271.2B' },
        { symbol: 'AMD', name: 'Advanced Micro Devices', price: '$128.90', change: '-$2.34', changePercent: '-1.78%', marketCap: '$207.8B' },
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

    const getChangeColor = (change: string) => {
        return change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Stocks Dashboard</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Portfolio tracking and market analysis</p>
                </div>

                <div className="flex items-center space-x-2">
                    <select
                        value={selectedTimeframe}
                        onChange={(e) => setSelectedTimeframe(e.target.value)}
                        className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                        <option value="1D">1 Day</option>
                        <option value="1W">1 Week</option>
                        <option value="1M">1 Month</option>
                        <option value="3M">3 Months</option>
                        <option value="1Y">1 Year</option>
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {portfolioStats.map((stat) => (
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
                {/* Portfolio Performance */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Portfolio Performance</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">12-month portfolio value trend</p>
                    </div>
                    <div className="h-80">
                        <LineChart data={portfolioData} />
                    </div>
                </div>

                {/* Sector Allocation */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sector Allocation</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Portfolio diversification by sector</p>
                    </div>
                    <div className="h-80">
                        <DoughnutChart data={sectorAllocationData} />
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Top Performers */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Top Performers</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Best performing stocks today</p>
                    </div>
                    <div className="space-y-4">
                        {topPerformers.map((stock, index) => (
                            <div key={index} className="flex items-center justify-between rounded-lg border border-gray-100 p-4 dark:border-gray-700">
                                <div className="flex items-center space-x-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{stock.symbol}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{stock.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Vol: {stock.volume}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{stock.price}</p>
                                    <p className={`text-xs font-medium ${getChangeColor(stock.change)}`}>
                                        {stock.change} ({stock.changePercent})
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Watchlist */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Watchlist</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Stocks you're monitoring</p>
                    </div>
                    <div className="space-y-4">
                        {watchlist.map((stock, index) => (
                            <div key={index} className="flex items-center justify-between rounded-lg border border-gray-100 p-4 dark:border-gray-700">
                                <div className="flex items-center space-x-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                                        <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{stock.symbol}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{stock.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Mkt Cap: {stock.marketCap}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{stock.price}</p>
                                    <p className={`text-xs font-medium ${getChangeColor(stock.change)}`}>
                                        {stock.change} ({stock.changePercent})
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Market Summary */}
            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Market Summary</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                            <ArrowTrendingUpIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">S&P 500</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">4,567.89</p>
                            <p className="text-xs text-green-600 dark:text-green-400">+1.2%</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                            <ChartBarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">NASDAQ</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">14,234.56</p>
                            <p className="text-xs text-green-600 dark:text-green-400">+0.8%</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                            <CurrencyDollarIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">DOW</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">34,567.89</p>
                            <p className="text-xs text-red-600 dark:text-red-400">-0.3%</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                            <ClockIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Market Status</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">Open</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Closes in 2h 15m</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StocksDashboard;
