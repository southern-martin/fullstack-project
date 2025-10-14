import {
    ArrowDownIcon,
    ArrowUpIcon,
    ChartBarIcon,
    ShoppingBagIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';
import React from 'react';

const Dashboard: React.FC = () => {
    const stats = [
        {
            name: 'Customers',
            value: '3,782',
            change: '11.01%',
            changeType: 'increase',
            icon: UserGroupIcon,
        },
        {
            name: 'Orders',
            value: '5,359',
            change: '9.05%',
            changeType: 'increase',
            icon: ShoppingBagIcon,
        },
    ];

    const recentOrders = [
        {
            id: 1,
            product: 'Macbook pro 13"',
            variants: '2 Variants',
            category: 'Laptop',
            price: '$2399.00',
            status: 'Delivered',
            statusColor: 'text-green-600',
        },
        {
            id: 2,
            product: 'Apple Watch Ultra',
            variants: '1 Variants',
            category: 'Watch',
            price: '$879.00',
            status: 'Pending',
            statusColor: 'text-yellow-600',
        },
        {
            id: 3,
            product: 'iPhone 15 Pro Max',
            variants: '2 Variants',
            category: 'SmartPhone',
            price: '$1869.00',
            status: 'Delivered',
            statusColor: 'text-green-600',
        },
        {
            id: 4,
            product: 'iPad Pro 3rd Gen',
            variants: '2 Variants',
            category: 'Electronics',
            price: '$1699.00',
            status: 'Canceled',
            statusColor: 'text-red-600',
        },
        {
            id: 5,
            product: 'Airpods Pro 2nd Gen',
            variants: '1 Variants',
            category: 'Accessories',
            price: '$240.00',
            status: 'Delivered',
            statusColor: 'text-green-600',
        },
    ];

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {/* Page Header */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                        #1 Tailwind CSS Dashboard
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Leading Tailwind CSS Admin Template with 400+ UI Component and Pages.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center justify-center rounded-md border border-stroke bg-white px-5 py-2 text-sm font-medium text-black hover:bg-gray-100 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-boxdark">
                        Purchase Plan
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.name} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                                <Icon className="w-6 h-6 fill-gray-800 dark:fill-white/90" />
                            </div>
                            <div className="mt-5 flex items-end justify-between">
                                <div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{stat.name}</span>
                                    <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">
                                        {stat.value}
                                    </h4>
                                </div>
                                <span className={`flex items-center gap-1 rounded-full py-0.5 pl-2 pr-2.5 text-sm font-medium ${stat.changeType === 'increase' ? 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500' : 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500'}`}>
                                    {stat.changeType === 'increase' ? (
                                        <ArrowUpIcon className="w-3 h-3 fill-current" />
                                    ) : (
                                        <ArrowDownIcon className="w-3 h-3 fill-current" />
                                    )}
                                    {stat.change}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts and Content Row */}
            <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                {/* Monthly Sales Chart */}
                <div className="col-span-12 xl:col-span-8">
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                Monthly Sales
                            </h3>
                            <div className="flex items-center gap-2">
                                <button className="text-sm text-primary hover:text-opacity-80">
                                    View More
                                </button>
                                <button className="text-sm text-red-600 hover:text-opacity-80">
                                    Delete
                                </button>
                            </div>
                        </div>
                        <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded">
                            <div className="text-center">
                                <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500 dark:text-gray-400">
                                    Monthly Sales Chart
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Monthly Target */}
                <div className="col-span-12 xl:col-span-4">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                        <div className="flex justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                    Monthly Target
                                </h3>
                                <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
                                    Target you've set for each month
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="text-sm text-primary hover:text-opacity-80">
                                    View More
                                </button>
                                <button className="text-sm text-red-600 hover:text-opacity-80">
                                    Delete
                                </button>
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-green-600 mb-4">
                                <ArrowUpIcon className="h-4 w-4" />
                                +10%
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                You earn $3287 today, it's higher than last month. Keep up your good work!
                            </p>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Target</span>
                                <span className="text-sm font-medium text-black dark:text-white">$20K</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Revenue</span>
                                <span className="text-sm font-medium text-black dark:text-white">$20K</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Today</span>
                                <span className="text-sm font-medium text-black dark:text-white">$20K</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics and Customer Demographics */}
            <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                {/* Statistics */}
                <div className="col-span-12 xl:col-span-7">
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                Statistics
                            </h3>
                            <div className="flex items-center gap-2">
                                <button className="text-sm text-primary hover:text-opacity-80">
                                    View More
                                </button>
                                <button className="text-sm text-red-600 hover:text-opacity-80">
                                    Delete
                                </button>
                            </div>
                        </div>
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Target you've set for each month
                            </p>
                            <div className="flex items-center gap-4 mb-4">
                                <button className="text-sm font-medium text-primary">Overview</button>
                                <button className="text-sm font-medium text-gray-600 dark:text-gray-400">Sales</button>
                                <button className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</button>
                            </div>
                        </div>
                        <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded">
                            <div className="text-center">
                                <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500 dark:text-gray-400">
                                    Statistics Chart
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customer Demographics */}
                <div className="col-span-12 xl:col-span-5">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                        <div className="flex justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                    Customers Demographic
                                </h3>
                                <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
                                    Number of customer based on country
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="text-sm text-primary hover:text-opacity-80">
                                    View More
                                </button>
                                <button className="text-sm text-red-600 hover:text-opacity-80">
                                    Delete
                                </button>
                            </div>
                        </div>
                        <div className="border-gary-200 my-6 overflow-hidden rounded-2xl border bg-gray-50 px-4 py-6 dark:border-gray-800 dark:bg-gray-900 sm:px-6">
                            <div className="h-[212px] w-full flex items-center justify-center">
                                <div className="text-center">
                                    <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Map visualization
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-full max-w-8 items-center rounded-full">
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">US</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-theme-sm font-semibold text-gray-800 dark:text-white/90">
                                            USA
                                        </p>
                                        <span className="block text-theme-xs text-gray-500 dark:text-gray-400">
                                            2,379 Customers
                                        </span>
                                    </div>
                                </div>
                                <div className="flex w-full max-w-[140px] items-center gap-3">
                                    <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                                        <div className="absolute left-0 top-0 flex h-full w-[79%] items-center justify-center rounded-sm bg-brand-500 text-xs font-medium text-white"></div>
                                    </div>
                                    <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                                        79%
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-full max-w-8 items-center rounded-full">
                                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">FR</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-theme-sm font-semibold text-gray-800 dark:text-white/90">
                                            France
                                        </p>
                                        <span className="block text-theme-xs text-gray-500 dark:text-gray-400">
                                            589 Customers
                                        </span>
                                    </div>
                                </div>
                                <div className="flex w-full max-w-[140px] items-center gap-3">
                                    <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                                        <div className="absolute left-0 top-0 flex h-full w-[23%] items-center justify-center rounded-sm bg-brand-500 text-xs font-medium text-white"></div>
                                    </div>
                                    <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                                        23%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="col-span-12 xl:col-span-7">
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
                    <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                Recent Orders
                            </h3>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                                Filter
                            </button>
                            <button className="text-sm text-primary hover:text-opacity-80">
                                See all
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                    <th className="min-w-[200px] px-6 py-4 font-medium text-black dark:text-white xl:pl-11">
                                        Products
                                    </th>
                                    <th className="min-w-[100px] px-6 py-4 font-medium text-black dark:text-white">
                                        Category
                                    </th>
                                    <th className="min-w-[100px] px-6 py-4 font-medium text-black dark:text-white">
                                        Price
                                    </th>
                                    <th className="min-w-[100px] px-6 py-4 font-medium text-black dark:text-white">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-stroke dark:border-strokedark">
                                        <td className="px-6 py-4 xl:pl-11">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                                    <span className="text-lg">📱</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-black dark:text-white">{order.product}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{order.variants}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-black dark:text-white">{order.category}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-black dark:text-white">{order.price}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${order.statusColor}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;