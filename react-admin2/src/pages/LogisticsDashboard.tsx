import {
    ArrowDownIcon,
    ArrowUpIcon,
    CheckCircleIcon,
    CurrencyDollarIcon,
    GlobeAltIcon,
    MapPinIcon,
    TruckIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { BarChart, DoughnutChart, LineChart } from '../components/Charts';

const LogisticsDashboard: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('30days');

    const logisticsStats = [
        {
            name: 'Total Shipments',
            value: '2,847',
            change: '+12.5%',
            changeType: 'increase',
            icon: TruckIcon,
            color: 'blue',
        },
        {
            name: 'On-Time Delivery',
            value: '94.2%',
            change: '+2.1%',
            changeType: 'increase',
            icon: CheckCircleIcon,
            color: 'green',
        },
        {
            name: 'Active Vehicles',
            value: '156',
            change: '+8',
            changeType: 'increase',
            icon: TruckIcon,
            color: 'purple',
        },
        {
            name: 'Delivery Cost',
            value: '$12.45',
            change: '-$0.85',
            changeType: 'decrease',
            icon: CurrencyDollarIcon,
            color: 'red',
        },
    ];

    const deliveryPerformanceData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'On-Time Deliveries',
                data: [89, 91, 88, 92, 90, 94, 93, 95, 92, 96, 94, 97],
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Delayed Deliveries',
                data: [11, 9, 12, 8, 10, 6, 7, 5, 8, 4, 6, 3],
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const shipmentStatusData = {
        labels: ['Delivered', 'In Transit', 'Processing', 'Delayed', 'Failed'],
        datasets: [
            {
                label: 'Shipment Status',
                data: [65, 20, 10, 4, 1],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(156, 163, 175, 0.8)',
                ],
                borderColor: [
                    'rgb(34, 197, 94)',
                    'rgb(59, 130, 246)',
                    'rgb(251, 191, 36)',
                    'rgb(239, 68, 68)',
                    'rgb(156, 163, 175)',
                ],
                borderWidth: 2,
            },
        ],
    };

    const routeEfficiencyData = {
        labels: ['Route A', 'Route B', 'Route C', 'Route D', 'Route E'],
        datasets: [
            {
                label: 'Efficiency Score',
                data: [92, 88, 95, 85, 90],
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

    const activeShipments = [
        { id: 'SH-001', destination: 'New York, NY', driver: 'John Smith', status: 'In Transit', eta: '2h 30m', vehicle: 'Truck-156' },
        { id: 'SH-002', destination: 'Los Angeles, CA', driver: 'Sarah Johnson', status: 'Processing', eta: '4h 15m', vehicle: 'Truck-203' },
        { id: 'SH-003', destination: 'Chicago, IL', driver: 'Mike Chen', status: 'In Transit', eta: '1h 45m', vehicle: 'Truck-089' },
        { id: 'SH-004', destination: 'Houston, TX', driver: 'Emily Davis', status: 'Delayed', eta: '6h 20m', vehicle: 'Truck-134' },
        { id: 'SH-005', destination: 'Phoenix, AZ', driver: 'David Wilson', status: 'In Transit', eta: '3h 10m', vehicle: 'Truck-178' },
    ];

    const fleetStatus = [
        { vehicle: 'Truck-001', driver: 'John Smith', status: 'Active', location: 'New York, NY', fuel: '85%', mileage: '245,678' },
        { vehicle: 'Truck-002', driver: 'Sarah Johnson', status: 'Maintenance', location: 'Service Center', fuel: '0%', mileage: '198,432' },
        { vehicle: 'Truck-003', driver: 'Mike Chen', status: 'Active', location: 'Los Angeles, CA', fuel: '72%', mileage: '312,567' },
        { vehicle: 'Truck-004', driver: 'Emily Davis', status: 'Active', location: 'Chicago, IL', fuel: '91%', mileage: '189,234' },
        { vehicle: 'Truck-005', driver: 'David Wilson', status: 'Idle', location: 'Houston, TX', fuel: '45%', mileage: '267,891' },
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
            'Delivered': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
            'In Transit': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
            'Processing': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
            'Delayed': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
            'Failed': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
            'Active': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
            'Maintenance': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
            'Idle': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
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
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Logistics Dashboard</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Fleet management and delivery tracking</p>
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
                {logisticsStats.map((stat) => (
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
                {/* Delivery Performance */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Delivery Performance</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">On-time vs delayed deliveries over time</p>
                    </div>
                    <div className="h-80">
                        <LineChart data={deliveryPerformanceData} />
                    </div>
                </div>

                {/* Shipment Status */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Shipment Status</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Current shipment distribution</p>
                    </div>
                    <div className="h-80">
                        <DoughnutChart data={shipmentStatusData} />
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Route Efficiency */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Route Efficiency</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Performance by delivery route</p>
                    </div>
                    <div className="h-64">
                        <BarChart data={routeEfficiencyData} />
                    </div>
                </div>

                {/* Active Shipments */}
                <div className="lg:col-span-2 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Active Shipments</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Currently in progress deliveries</p>
                    </div>
                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Shipment ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Destination
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Driver
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        ETA
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                                {activeShipments.map((shipment, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            {shipment.id}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {shipment.destination}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {shipment.driver}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            {getStatusBadge(shipment.status)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {shipment.eta}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Fleet Status */}
            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Fleet Status</h3>
                <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Vehicle
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Driver
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Location
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Fuel Level
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Mileage
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                            {fleetStatus.map((vehicle, index) => (
                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                        {vehicle.vehicle}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {vehicle.driver}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {getStatusBadge(vehicle.status)}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {vehicle.location}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {vehicle.fuel}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {vehicle.mileage.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Logistics Insights */}
            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Logistics Insights</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                            <TruckIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Delivery Time</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">2.4 hours</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                            <MapPinIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Coverage Area</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">47 States</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                            <UserGroupIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Drivers</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">142</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                            <GlobeAltIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Routes Optimized</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">89%</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogisticsDashboard;
