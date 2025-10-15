import {
    ArrowDownTrayIcon,
    ArrowPathIcon,
    EyeIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';

interface Transaction {
    id: number;
    transactionId: string;
    type: 'payment' | 'refund' | 'charge' | 'transfer';
    amount: number;
    currency: string;
    status: 'completed' | 'pending' | 'failed' | 'cancelled';
    description: string;
    customerName: string;
    customerEmail: string;
    paymentMethod: string;
    createdAt: string;
    processedAt?: string;
    fees?: number;
}

const Transactions: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    const transactions: Transaction[] = [
        {
            id: 1,
            transactionId: 'TXN-001',
            type: 'payment',
            amount: 2500.00,
            currency: 'USD',
            status: 'completed',
            description: 'Website Development Services',
            customerName: 'Acme Corporation',
            customerEmail: 'billing@acme.com',
            paymentMethod: 'Visa ending in 4242',
            createdAt: '2024-01-15T10:30:00Z',
            processedAt: '2024-01-15T10:31:00Z',
            fees: 75.00,
        },
        {
            id: 2,
            transactionId: 'TXN-002',
            type: 'refund',
            amount: -500.00,
            currency: 'USD',
            status: 'completed',
            description: 'Refund for cancelled service',
            customerName: 'Tech Solutions Inc',
            customerEmail: 'finance@techsolutions.com',
            paymentMethod: 'Mastercard ending in 5555',
            createdAt: '2024-01-14T14:20:00Z',
            processedAt: '2024-01-14T14:21:00Z',
            fees: 0,
        },
        {
            id: 3,
            transactionId: 'TXN-003',
            type: 'payment',
            amount: 1800.00,
            currency: 'USD',
            status: 'pending',
            description: 'Mobile App Development',
            customerName: 'Digital Marketing Co',
            customerEmail: 'accounts@digitalmarketing.com',
            paymentMethod: 'Bank Account ending in 1234',
            createdAt: '2024-01-13T09:15:00Z',
            fees: 54.00,
        },
        {
            id: 4,
            transactionId: 'TXN-004',
            type: 'charge',
            amount: 950.00,
            currency: 'USD',
            status: 'failed',
            description: 'SEO Services',
            customerName: 'StartupXYZ',
            customerEmail: 'hello@startupxyz.com',
            paymentMethod: 'Visa ending in 4242',
            createdAt: '2024-01-12T16:45:00Z',
            fees: 28.50,
        },
        {
            id: 5,
            transactionId: 'TXN-005',
            type: 'transfer',
            amount: 3200.00,
            currency: 'USD',
            status: 'completed',
            description: 'E-commerce Platform Development',
            customerName: 'Global Enterprises',
            customerEmail: 'billing@globalenterprises.com',
            paymentMethod: 'Wire Transfer',
            createdAt: '2024-01-11T11:00:00Z',
            processedAt: '2024-01-11T11:05:00Z',
            fees: 25.00,
        },
    ];

    const types = ['all', 'payment', 'refund', 'charge', 'transfer'];
    const statuses = ['all', 'completed', 'pending', 'failed', 'cancelled'];

    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch = transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === 'all' || transaction.type === selectedType;
        const matchesStatus = selectedStatus === 'all' || transaction.status === selectedStatus;
        return matchesSearch && matchesType && matchesStatus;
    });

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'payment':
                return 'bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-500';
            case 'refund':
                return 'bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-500';
            case 'charge':
                return 'bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-500';
            case 'transfer':
                return 'bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-500';
            default:
                return 'bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-500';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-500';
            case 'pending':
                return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-500';
            case 'failed':
                return 'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-500';
            case 'cancelled':
                return 'bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-500';
            default:
                return 'bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-500';
        }
    };

    const getAmountColor = (amount: number) => {
        if (amount > 0) {
            return 'text-green-600 dark:text-green-400';
        } else if (amount < 0) {
            return 'text-red-600 dark:text-red-400';
        }
        return 'text-gray-600 dark:text-gray-400';
    };

    const handleViewTransaction = (id: number) => {
        console.log('View transaction:', id);
    };

    const handleDownloadTransaction = (id: number) => {
        console.log('Download transaction:', id);
    };

    const getTotalAmount = () => {
        return filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    };

    const getCompletedAmount = () => {
        return filteredTransactions
            .filter(transaction => transaction.status === 'completed')
            .reduce((sum, transaction) => sum + transaction.amount, 0);
    };

    const getTotalFees = () => {
        return filteredTransactions
            .filter(transaction => transaction.fees)
            .reduce((sum, transaction) => sum + (transaction.fees || 0), 0);
    };

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {/* Page Header */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-black dark:text-white">
                        Transactions
                    </h2>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        View and manage all your financial transactions.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                        <ArrowPathIcon className="w-4 h-4" />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                            <ArrowPathIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Total Amount</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                ${getTotalAmount().toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                            <ArrowPathIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                ${getCompletedAmount().toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                            <ArrowPathIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Total Fees</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                ${getTotalFees().toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        {/* Search */}
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:w-80"
                            />
                        </div>

                        {/* Type Filter */}
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                            {types.map((type) => (
                                <option key={type} value={type}>
                                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                                </option>
                            ))}
                        </select>

                        {/* Status Filter */}
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                            {statuses.map((status) => (
                                <option key={status} value={status}>
                                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                        >
                            <FunnelIcon className="w-4 h-4" />
                            Filters
                        </button>
                    </div>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                    <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Date Range
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="date"
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                    <span className="text-xs text-gray-500">to</span>
                                    <input
                                        type="date"
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Amount Range
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                    <span className="text-xs text-gray-500">to</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Payment Method
                                </label>
                                <select className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                                    <option value="all">All Methods</option>
                                    <option value="card">Credit Card</option>
                                    <option value="bank">Bank Transfer</option>
                                    <option value="wire">Wire Transfer</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Transactions Table */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
                <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                            Transaction List ({filteredTransactions.length} transactions)
                        </h3>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                <th className="min-w-[120px] px-4 py-3 text-xs font-medium text-black dark:text-white xl:pl-6">
                                    Transaction ID
                                </th>
                                <th className="min-w-[100px] px-4 py-3 text-xs font-medium text-black dark:text-white">
                                    Type
                                </th>
                                <th className="min-w-[100px] px-4 py-3 text-xs font-medium text-black dark:text-white">
                                    Amount
                                </th>
                                <th className="min-w-[100px] px-4 py-3 text-xs font-medium text-black dark:text-white">
                                    Status
                                </th>
                                <th className="min-w-[150px] px-4 py-3 text-xs font-medium text-black dark:text-white">
                                    Customer
                                </th>
                                <th className="min-w-[150px] px-4 py-3 text-xs font-medium text-black dark:text-white">
                                    Payment Method
                                </th>
                                <th className="min-w-[120px] px-4 py-3 text-xs font-medium text-black dark:text-white">
                                    Date
                                </th>
                                <th className="min-w-[100px] px-4 py-3 text-xs font-medium text-black dark:text-white">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map((transaction) => (
                                <tr key={transaction.id} className="border-b border-stroke dark:border-strokedark">
                                    <td className="px-4 py-3 xl:pl-6">
                                        <p className="text-xs font-medium text-black dark:text-white">{transaction.transactionId}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.description}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex rounded-full bg-opacity-10 px-2 py-1 text-xs font-medium capitalize ${getTypeColor(transaction.type)}`}>
                                            {transaction.type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className={`text-xs font-medium ${getAmountColor(transaction.amount)}`}>
                                            {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)} {transaction.currency}
                                        </p>
                                        {transaction.fees && transaction.fees > 0 && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Fee: ${transaction.fees.toFixed(2)}
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex rounded-full bg-opacity-10 px-2 py-1 text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                            {transaction.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-xs font-medium text-black dark:text-white">{transaction.customerName}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.customerEmail}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-xs text-black dark:text-white">{transaction.paymentMethod}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-xs text-black dark:text-white">
                                            {new Date(transaction.createdAt).toLocaleDateString()}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {new Date(transaction.createdAt).toLocaleTimeString()}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleViewTransaction(transaction.id)}
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                title="View"
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDownloadTransaction(transaction.id)}
                                                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                                                title="Download"
                                            >
                                                <ArrowDownTrayIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Transactions;
