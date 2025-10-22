import {
    ArrowDownIcon,
    ArrowUpIcon,
    BanknotesIcon,
    ChartBarIcon,
    CurrencyDollarIcon,
    ShoppingBagIcon,
    ShoppingCartIcon,
    TruckIcon,
    UserGroupIcon,
    UsersIcon
} from '@heroicons/react/24/outline';
import React, { useMemo } from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    PieLabelRenderProps,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import Card from '../../../shared/components/ui/Card';
import { useDashboardLabels } from '../hooks/useDashboardLabels';

// Mock data for demonstration - in real app, this would come from APIs
const mockData = {
    // Sales data for the last 7 days
    salesData: [
        { date: '2024-01-01', sales: 2400, orders: 120, revenue: 48000 },
        { date: '2024-01-02', sales: 1398, orders: 98, revenue: 27960 },
        { date: '2024-01-03', sales: 9800, orders: 245, revenue: 196000 },
        { date: '2024-01-04', sales: 3908, orders: 156, revenue: 78160 },
        { date: '2024-01-05', sales: 4800, orders: 200, revenue: 96000 },
        { date: '2024-01-06', sales: 3800, orders: 158, revenue: 76000 },
        { date: '2024-01-07', sales: 4300, orders: 180, revenue: 86000 },
    ],

    // Top selling products
    topProducts: [
        { name: 'Electronics', sales: 400, revenue: 120000, color: '#8884d8' },
        { name: 'Clothing', sales: 300, revenue: 90000, color: '#82ca9d' },
        { name: 'Home & Garden', sales: 200, revenue: 60000, color: '#ffc658' },
        { name: 'Sports', sales: 150, revenue: 45000, color: '#ff7300' },
        { name: 'Books', sales: 100, revenue: 30000, color: '#00ff00' },
    ],

    // Seller performance
    sellerPerformance: [
        { name: 'Jan', sellers: 45, activeSellers: 38 },
        { name: 'Feb', sellers: 52, activeSellers: 44 },
        { name: 'Mar', sellers: 48, activeSellers: 41 },
        { name: 'Apr', sellers: 61, activeSellers: 55 },
        { name: 'May', sellers: 55, activeSellers: 48 },
        { name: 'Jun', sellers: 67, activeSellers: 59 },
    ],

    // Revenue by category
    revenueByCategory: [
        { name: 'Electronics', value: 35, color: '#8884d8' },
        { name: 'Clothing', value: 25, color: '#82ca9d' },
        { name: 'Home & Garden', value: 20, color: '#ffc658' },
        { name: 'Sports', value: 12, color: '#ff7300' },
        { name: 'Books', value: 8, color: '#00ff00' },
    ],

    // Recent orders
    recentOrders: [
        { id: '#12345', customer: 'John Doe', seller: 'TechStore', amount: 299.99, status: 'completed' },
        { id: '#12346', customer: 'Jane Smith', seller: 'FashionHub', amount: 149.50, status: 'shipped' },
        { id: '#12347', customer: 'Bob Johnson', seller: 'HomeGoods', amount: 89.99, status: 'processing' },
        { id: '#12348', customer: 'Alice Brown', seller: 'SportsWorld', amount: 199.99, status: 'completed' },
        { id: '#12349', customer: 'Charlie Wilson', seller: 'BookStore', amount: 24.99, status: 'pending' },
    ]
};

const StatCard: React.FC<{
    title: string;
    value: string | number;
    change: number;
    icon: React.ReactNode;
    color: string;
    vsLastMonthLabel: string;
}> = ({ title, value, change, icon, color, vsLastMonthLabel }) => {
    const isPositive = change >= 0;

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    <div className="flex items-center mt-2">
                        {isPositive ? (
                            <ArrowUpIcon className="h-4 w-4 text-green-500" />
                        ) : (
                            <ArrowDownIcon className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ml-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {Math.abs(change)}%
                        </span>
                        <span className="text-sm text-gray-500 ml-1">{vsLastMonthLabel}</span>
                    </div>
                </div>
                <div className={`p-3 rounded-full ${color}`}>
                    {icon}
                </div>
            </div>
        </Card>
    );
};

const EcommerceDashboard: React.FC = () => {
    const { labels: L } = useDashboardLabels();
    const stats = useMemo(() => ({
        totalRevenue: 1250000,
        totalOrders: 15420,
        totalSellers: 245,
        totalCustomers: 12580,
        revenueChange: 12.5,
        ordersChange: 8.3,
        sellersChange: 15.2,
        customersChange: 6.7,
    }), []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">{L.ECOMMERCE_TITLE}</h1>
                <p className="text-gray-600">{L.ECOMMERCE_SUBTITLE}</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title={L.STATS_TOTAL_REVENUE}
                    value={`$${stats.totalRevenue.toLocaleString()}`}
                    change={stats.revenueChange}
                    icon={<CurrencyDollarIcon className="h-6 w-6 text-white" />}
                    color="bg-green-500"
                    vsLastMonthLabel={L.STATS_VS_LAST_MONTH}
                />
                <StatCard
                    title={L.STATS_TOTAL_ORDERS}
                    value={stats.totalOrders.toLocaleString()}
                    change={stats.ordersChange}
                    icon={<ShoppingCartIcon className="h-6 w-6 text-white" />}
                    color="bg-blue-500"
                    vsLastMonthLabel={L.STATS_VS_LAST_MONTH}
                />
                <StatCard
                    title={L.STATS_ACTIVE_SELLERS}
                    value={stats.totalSellers}
                    change={stats.sellersChange}
                    icon={<UserGroupIcon className="h-6 w-6 text-white" />}
                    color="bg-purple-500"
                    vsLastMonthLabel={L.STATS_VS_LAST_MONTH}
                />
                <StatCard
                    title={L.STATS_TOTAL_CUSTOMERS}
                    value={stats.totalCustomers.toLocaleString()}
                    change={stats.customersChange}
                    icon={<UsersIcon className="h-6 w-6 text-white" />}
                    color="bg-orange-500"
                    vsLastMonthLabel={L.STATS_VS_LAST_MONTH}
                />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Trend */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{L.CHART_SALES_TREND}</h3>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">{L.CHART_LEGEND_REVENUE}</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={mockData.salesData}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip
                                formatter={(value: any) => [`$${value.toLocaleString()}`, L.CHART_LEGEND_REVENUE]}
                                labelFormatter={(label) => `${L.ECOMMERCE_DATE}: ${label}`}
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#3B82F6"
                                fill="#3B82F6"
                                fillOpacity={0.3}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>

                {/* Orders Trend */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{L.CHART_ORDERS_TREND}</h3>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">{L.CHART_LEGEND_ORDERS}</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={mockData.salesData}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip
                                formatter={(value: any) => [value, L.CHART_LEGEND_ORDERS]}
                                labelFormatter={(label) => `${L.ECOMMERCE_DATE}: ${label}`}
                            />
                            <Line
                                type="monotone"
                                dataKey="orders"
                                stroke="#10B981"
                                strokeWidth={3}
                                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{L.CHART_TOP_PRODUCTS}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={mockData.topProducts} layout="horizontal">
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={100} />
                            <Tooltip
                                formatter={(value: any) => [value, L.ECOMMERCE_CHART_SALES]}
                                labelFormatter={(label) => `${L.ECOMMERCE_CHART_PRODUCT}: ${label}`}
                            />
                            <Bar dataKey="sales" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                {/* Revenue by Category */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{L.CHART_REVENUE_BY_CATEGORY}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={mockData.revenueByCategory}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={(props: PieLabelRenderProps) => `${props.name} ${props.value}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {mockData.revenueByCategory.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: any) => [`${value}%`, L.CHART_LEGEND_REVENUE]} />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* Charts Row 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Seller Performance */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{L.CHART_SELLER_PERFORMANCE}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={mockData.sellerPerformance}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="sellers" fill="#8884d8" name={L.ECOMMERCE_CHART_TOTAL_SELLERS} />
                            <Bar dataKey="activeSellers" fill="#82ca9d" name={L.ECOMMERCE_CHART_ACTIVE_SELLERS} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                {/* Recent Orders */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{L.CHART_RECENT_ORDERS}</h3>
                    <div className="space-y-4">
                        {mockData.recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        <ShoppingBagIcon className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{order.id}</p>
                                        <p className="text-sm text-gray-500">{order.customer} • {order.seller}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">${order.amount}</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {order.status === 'completed' ? L.STATUS_COMPLETED :
                                            order.status === 'shipped' ? L.STATUS_SHIPPED :
                                                order.status === 'processing' ? L.STATUS_PROCESSING :
                                                    L.STATUS_PENDING}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <TruckIcon className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">{L.STATS_AVG_DELIVERY_TIME}</p>
                            <p className="text-2xl font-semibold text-gray-900">2.3 {L.TIME_DAYS}</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <ChartBarIcon className="h-8 w-8 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">{L.STATS_CONVERSION_RATE}</p>
                            <p className="text-2xl font-semibold text-gray-900">3.2%</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <BanknotesIcon className="h-8 w-8 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">{L.STATS_AVG_ORDER_VALUE}</p>
                            <p className="text-2xl font-semibold text-gray-900">$89.50</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default EcommerceDashboard;
