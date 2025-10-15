import {
    BanknotesIcon,
    CreditCardIcon,
    DocumentTextIcon,
    EyeIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';

interface BillingMethod {
    id: number;
    type: 'card' | 'bank';
    name: string;
    lastFour: string;
    expiry?: string;
    isDefault: boolean;
    status: 'active' | 'inactive';
}

interface Transaction {
    id: number;
    date: string;
    description: string;
    amount: number;
    type: 'payment' | 'refund' | 'charge';
    status: 'completed' | 'pending' | 'failed';
    method: string;
}

const Billing: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'methods' | 'transactions' | 'invoices'>('methods');

    const billingMethods: BillingMethod[] = [
        {
            id: 1,
            type: 'card',
            name: 'Visa ending in 4242',
            lastFour: '4242',
            expiry: '12/25',
            isDefault: true,
            status: 'active',
        },
        {
            id: 2,
            type: 'card',
            name: 'Mastercard ending in 5555',
            lastFour: '5555',
            expiry: '08/26',
            isDefault: false,
            status: 'active',
        },
        {
            id: 3,
            type: 'bank',
            name: 'Bank Account ending in 1234',
            lastFour: '1234',
            isDefault: false,
            status: 'active',
        },
    ];

    const transactions: Transaction[] = [
        {
            id: 1,
            date: '2024-01-15',
            description: 'Monthly subscription - Pro Plan',
            amount: 29.99,
            type: 'payment',
            status: 'completed',
            method: 'Visa ending in 4242',
        },
        {
            id: 2,
            date: '2024-01-10',
            description: 'Refund - Annual Plan',
            amount: -299.99,
            type: 'refund',
            status: 'completed',
            method: 'Visa ending in 4242',
        },
        {
            id: 3,
            date: '2024-01-05',
            description: 'Setup fee',
            amount: 50.00,
            type: 'charge',
            status: 'completed',
            method: 'Mastercard ending in 5555',
        },
        {
            id: 4,
            date: '2024-01-01',
            description: 'Monthly subscription - Basic Plan',
            amount: 9.99,
            type: 'payment',
            status: 'pending',
            method: 'Bank Account ending in 1234',
        },
    ];

    const handleAddMethod = () => {
        console.log('Add billing method');
    };

    const handleViewMethod = (id: number) => {
        console.log('View method:', id);
    };

    const handleEditMethod = (id: number) => {
        console.log('Edit method:', id);
    };

    const handleDeleteMethod = (id: number) => {
        console.log('Delete method:', id);
    };

    const handleSetDefault = (id: number) => {
        console.log('Set default method:', id);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
            case 'active':
                return 'bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-500';
            case 'pending':
                return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-500';
            case 'failed':
            case 'inactive':
                return 'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-500';
            default:
                return 'bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-500';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'payment':
            case 'charge':
                return 'text-red-600 dark:text-red-400';
            case 'refund':
                return 'text-green-600 dark:text-green-400';
            default:
                return 'text-gray-600 dark:text-gray-400';
        }
    };

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {/* Page Header */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-black dark:text-white">
                        Billing & Payments
                    </h2>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        Manage your billing methods, transactions, and invoices.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleAddMethod}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-xs font-medium text-white shadow-theme-xs hover:bg-primary-600 transition-all duration-200"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Add Payment Method
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-8">
                        {[
                            { id: 'methods', label: 'Payment Methods', count: billingMethods.length },
                            { id: 'transactions', label: 'Transactions', count: transactions.length },
                            { id: 'invoices', label: 'Invoices', count: 0 },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`py-2 px-1 border-b-2 font-medium text-xs ${activeTab === tab.id
                                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                    }`}
                            >
                                {tab.label}
                                <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'methods' && (
                <div className="space-y-6">
                    {/* Payment Methods */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {billingMethods.map((method) => (
                            <div
                                key={method.id}
                                className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                                            {method.type === 'card' ? (
                                                <CreditCardIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            ) : (
                                                <BanknotesIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                                {method.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {method.type === 'card' ? 'Credit Card' : 'Bank Account'}
                                            </p>
                                        </div>
                                    </div>
                                    {method.isDefault && (
                                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600 dark:bg-green-500/15 dark:text-green-500">
                                            Default
                                        </span>
                                    )}
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex rounded-full bg-opacity-10 px-2 py-1 text-xs font-medium ${getStatusColor(method.status)}`}>
                                            {method.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleViewMethod(method.id)}
                                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                            title="View"
                                        >
                                            <EyeIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleEditMethod(method.id)}
                                            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                                            title="Edit"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteMethod(method.id)}
                                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                            title="Delete"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {!method.isDefault && (
                                    <div className="mt-4">
                                        <button
                                            onClick={() => handleSetDefault(method.id)}
                                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                        >
                                            Set as Default
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'transactions' && (
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                    <th className="min-w-[120px] px-4 py-3 text-xs font-medium text-black dark:text-white xl:pl-6">
                                        Date
                                    </th>
                                    <th className="min-w-[200px] px-4 py-3 text-xs font-medium text-black dark:text-white">
                                        Description
                                    </th>
                                    <th className="min-w-[100px] px-4 py-3 text-xs font-medium text-black dark:text-white">
                                        Amount
                                    </th>
                                    <th className="min-w-[100px] px-4 py-3 text-xs font-medium text-black dark:text-white">
                                        Type
                                    </th>
                                    <th className="min-w-[100px] px-4 py-3 text-xs font-medium text-black dark:text-white">
                                        Status
                                    </th>
                                    <th className="min-w-[150px] px-4 py-3 text-xs font-medium text-black dark:text-white">
                                        Payment Method
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction) => (
                                    <tr key={transaction.id} className="border-b border-stroke dark:border-strokedark">
                                        <td className="px-4 py-3 xl:pl-6">
                                            <p className="text-xs text-black dark:text-white">
                                                {new Date(transaction.date).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-xs text-black dark:text-white">{transaction.description}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className={`text-xs font-medium ${getTypeColor(transaction.type)}`}>
                                                {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex rounded-full bg-opacity-10 px-2 py-1 text-xs font-medium capitalize bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-500">
                                                {transaction.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex rounded-full bg-opacity-10 px-2 py-1 text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                                {transaction.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-xs text-black dark:text-white">{transaction.method}</p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'invoices' && (
                <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-white/[0.03]">
                    <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-white">No invoices yet</h3>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Your invoices will appear here once you start using our services.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Billing;
