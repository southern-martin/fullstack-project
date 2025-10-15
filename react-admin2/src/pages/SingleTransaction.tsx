import {
    ArrowDownTrayIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    PrinterIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Transaction {
    id: number;
    transactionId: string;
    type: 'payment' | 'refund' | 'charge' | 'transfer';
    amount: number;
    currency: string;
    status: 'completed' | 'pending' | 'failed' | 'cancelled';
    description: string;
    customer: {
        name: string;
        email: string;
        phone?: string;
        address?: string;
    };
    paymentMethod: {
        type: string;
        details: string;
        lastFour?: string;
    };
    fees: {
        amount: number;
        percentage: number;
    };
    timeline: {
        createdAt: string;
        processedAt?: string;
        completedAt?: string;
        failedAt?: string;
    };
    metadata: {
        invoiceId?: string;
        orderId?: string;
        reference?: string;
    };
}

const SingleTransaction: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Mock transaction data - in real app, this would be fetched based on the ID
    const transaction: Transaction = {
        id: 1,
        transactionId: 'TXN-001',
        type: 'payment',
        amount: 2500.00,
        currency: 'USD',
        status: 'completed',
        description: 'Website Development Services',
        customer: {
            name: 'Acme Corporation',
            email: 'billing@acme.com',
            phone: '+1 (555) 123-4567',
            address: '123 Business Street, New York, NY 10001',
        },
        paymentMethod: {
            type: 'Credit Card',
            details: 'Visa ending in 4242',
            lastFour: '4242',
        },
        fees: {
            amount: 75.00,
            percentage: 3.0,
        },
        timeline: {
            createdAt: '2024-01-15T10:30:00Z',
            processedAt: '2024-01-15T10:31:00Z',
            completedAt: '2024-01-15T10:32:00Z',
        },
        metadata: {
            invoiceId: 'INV-001',
            orderId: 'ORD-001',
            reference: 'REF-001',
        },
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />;
            case 'pending':
                return <ClockIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
            case 'failed':
                return <XCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />;
            case 'cancelled':
                return <ExclamationTriangleIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
            default:
                return <ClockIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
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

    const getAmountColor = (amount: number) => {
        if (amount > 0) {
            return 'text-green-600 dark:text-green-400';
        } else if (amount < 0) {
            return 'text-red-600 dark:text-red-400';
        }
        return 'text-gray-600 dark:text-gray-400';
    };

    const handleDownload = () => {
        console.log('Download transaction receipt');
    };

    const handlePrint = () => {
        window.print();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {/* Page Header */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/transactions')}
                        className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                        <ArrowLeftIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                    <div>
                        <h2 className="text-lg font-semibold text-black dark:text-white">
                            Transaction {transaction.transactionId}
                        </h2>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            View transaction details and history
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handlePrint}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                    >
                        <PrinterIcon className="w-4 h-4" />
                        Print
                    </button>
                    <button
                        onClick={handleDownload}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-xs font-medium text-white shadow-theme-xs hover:bg-primary-600 transition-all duration-200"
                    >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                        Download Receipt
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main Transaction Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Transaction Overview */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                                Transaction Overview
                            </h3>
                            <div className="flex items-center gap-2">
                                {getStatusIcon(transaction.status)}
                                <span className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                    {transaction.status.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Transaction ID</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{transaction.transactionId}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Type</p>
                                <span className={`inline-flex rounded-full bg-opacity-10 px-2 py-1 text-xs font-medium capitalize ${getTypeColor(transaction.type)}`}>
                                    {transaction.type}
                                </span>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                                <p className={`text-lg font-semibold ${getAmountColor(transaction.amount)}`}>
                                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)} {transaction.currency}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Description</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                        <h3 className="mb-6 text-base font-semibold text-gray-800 dark:text-white/90">
                            Customer Information
                        </h3>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Name</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{transaction.customer.name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{transaction.customer.email}</p>
                            </div>
                            {transaction.customer.phone && (
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{transaction.customer.phone}</p>
                                </div>
                            )}
                            {transaction.customer.address && (
                                <div className="sm:col-span-2">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{transaction.customer.address}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                        <h3 className="mb-6 text-base font-semibold text-gray-800 dark:text-white/90">
                            Payment Method
                        </h3>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Type</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{transaction.paymentMethod.type}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Details</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{transaction.paymentMethod.details}</p>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Timeline */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                        <h3 className="mb-6 text-base font-semibold text-gray-800 dark:text-white/90">
                            Transaction Timeline
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                                    <ClockIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Transaction Created</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(transaction.timeline.createdAt)}</p>
                                </div>
                            </div>

                            {transaction.timeline.processedAt && (
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                                        <ClockIcon className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Processing Started</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(transaction.timeline.processedAt)}</p>
                                    </div>
                                </div>
                            )}

                            {transaction.timeline.completedAt && (
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                                        <CheckCircleIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Transaction Completed</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(transaction.timeline.completedAt)}</p>
                                    </div>
                                </div>
                            )}

                            {transaction.timeline.failedAt && (
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                                        <XCircleIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Transaction Failed</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(transaction.timeline.failedAt)}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Transaction Summary */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                        <h3 className="mb-6 text-base font-semibold text-gray-800 dark:text-white/90">
                            Transaction Summary
                        </h3>

                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Gross Amount</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    ${transaction.amount.toFixed(2)} {transaction.currency}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Processing Fee</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    ${transaction.fees.amount.toFixed(2)} ({transaction.fees.percentage}%)
                                </span>
                            </div>
                            <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                                <div className="flex justify-between">
                                    <span className="text-base font-semibold text-gray-900 dark:text-white">Net Amount</span>
                                    <span className={`text-base font-semibold ${getAmountColor(transaction.amount - transaction.fees.amount)}`}>
                                        ${(transaction.amount - transaction.fees.amount).toFixed(2)} {transaction.currency}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                        <h3 className="mb-6 text-base font-semibold text-gray-800 dark:text-white/90">
                            Reference Information
                        </h3>

                        <div className="space-y-3">
                            {transaction.metadata.invoiceId && (
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Invoice ID</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{transaction.metadata.invoiceId}</p>
                                </div>
                            )}
                            {transaction.metadata.orderId && (
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Order ID</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{transaction.metadata.orderId}</p>
                                </div>
                            )}
                            {transaction.metadata.reference && (
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Reference</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{transaction.metadata.reference}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleTransaction;
