import {
    ArrowDownTrayIcon,
    DocumentTextIcon,
    EyeIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';

interface Invoice {
    id: number;
    invoiceNumber: string;
    clientName: string;
    clientEmail: string;
    amount: number;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    issueDate: string;
    dueDate: string;
    description: string;
}

const Invoices: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    const invoices: Invoice[] = [
        {
            id: 1,
            invoiceNumber: 'INV-001',
            clientName: 'Acme Corporation',
            clientEmail: 'billing@acme.com',
            amount: 2500.00,
            status: 'paid',
            issueDate: '2024-01-15',
            dueDate: '2024-02-15',
            description: 'Website Development Services',
        },
        {
            id: 2,
            invoiceNumber: 'INV-002',
            clientName: 'Tech Solutions Inc',
            clientEmail: 'finance@techsolutions.com',
            amount: 1800.00,
            status: 'sent',
            issueDate: '2024-01-20',
            dueDate: '2024-02-20',
            description: 'Mobile App Development',
        },
        {
            id: 3,
            invoiceNumber: 'INV-003',
            clientName: 'Digital Marketing Co',
            clientEmail: 'accounts@digitalmarketing.com',
            amount: 950.00,
            status: 'overdue',
            issueDate: '2024-01-10',
            dueDate: '2024-02-10',
            description: 'SEO Services',
        },
        {
            id: 4,
            invoiceNumber: 'INV-004',
            clientName: 'StartupXYZ',
            clientEmail: 'hello@startupxyz.com',
            amount: 3200.00,
            status: 'draft',
            issueDate: '2024-01-25',
            dueDate: '2024-02-25',
            description: 'E-commerce Platform Development',
        },
        {
            id: 5,
            invoiceNumber: 'INV-005',
            clientName: 'Global Enterprises',
            clientEmail: 'billing@globalenterprises.com',
            amount: 1500.00,
            status: 'cancelled',
            issueDate: '2024-01-05',
            dueDate: '2024-02-05',
            description: 'Consulting Services',
        },
    ];

    const statuses = ['all', 'draft', 'sent', 'paid', 'overdue', 'cancelled'];

    const filteredInvoices = invoices.filter(invoice => {
        const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.clientEmail.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || invoice.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-500';
            case 'sent':
                return 'bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-500';
            case 'draft':
                return 'bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-500';
            case 'overdue':
                return 'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-500';
            case 'cancelled':
                return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-500';
            default:
                return 'bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-500';
        }
    };

    const handleCreateInvoice = () => {
        console.log('Create new invoice');
    };

    const handleViewInvoice = (id: number) => {
        console.log('View invoice:', id);
    };

    const handleEditInvoice = (id: number) => {
        console.log('Edit invoice:', id);
    };

    const handleDeleteInvoice = (id: number) => {
        console.log('Delete invoice:', id);
    };

    const handleDownloadInvoice = (id: number) => {
        console.log('Download invoice:', id);
    };

    const getTotalAmount = () => {
        return filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
    };

    const getPaidAmount = () => {
        return filteredInvoices
            .filter(invoice => invoice.status === 'paid')
            .reduce((sum, invoice) => sum + invoice.amount, 0);
    };

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {/* Page Header */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-black dark:text-white">
                        Invoices
                    </h2>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        Manage your invoices and track payments.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleCreateInvoice}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-xs font-medium text-white shadow-theme-xs hover:bg-primary-600 transition-all duration-200"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Create Invoice
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                            <DocumentTextIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Total Invoices</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {filteredInvoices.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                            <DocumentTextIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
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
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                            <DocumentTextIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Paid Amount</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                ${getPaidAmount().toFixed(2)}
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
                                placeholder="Search invoices..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:w-80"
                            />
                        </div>

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
                                    Client
                                </label>
                                <input
                                    type="text"
                                    placeholder="Client name or email"
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Invoices Table */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
                <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                            Invoice List ({filteredInvoices.length} invoices)
                        </h3>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                <th className="min-w-[120px] px-4 py-3 text-xs font-medium text-black dark:text-white xl:pl-6">
                                    Invoice #
                                </th>
                                <th className="min-w-[150px] px-4 py-3 text-xs font-medium text-black dark:text-white">
                                    Client
                                </th>
                                <th className="min-w-[100px] px-4 py-3 text-xs font-medium text-black dark:text-white">
                                    Amount
                                </th>
                                <th className="min-w-[100px] px-4 py-3 text-xs font-medium text-black dark:text-white">
                                    Status
                                </th>
                                <th className="min-w-[100px] px-4 py-3 text-xs font-medium text-black dark:text-white">
                                    Issue Date
                                </th>
                                <th className="min-w-[100px] px-4 py-3 text-xs font-medium text-black dark:text-white">
                                    Due Date
                                </th>
                                <th className="min-w-[120px] px-4 py-3 text-xs font-medium text-black dark:text-white">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInvoices.map((invoice) => (
                                <tr key={invoice.id} className="border-b border-stroke dark:border-strokedark">
                                    <td className="px-4 py-3 xl:pl-6">
                                        <p className="text-xs font-medium text-black dark:text-white">{invoice.invoiceNumber}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{invoice.description}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-xs font-medium text-black dark:text-white">{invoice.clientName}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{invoice.clientEmail}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-xs font-medium text-black dark:text-white">${invoice.amount.toFixed(2)}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex rounded-full bg-opacity-10 px-2 py-1 text-xs font-medium ${getStatusColor(invoice.status)}`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-xs text-black dark:text-white">
                                            {new Date(invoice.issueDate).toLocaleDateString()}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-xs text-black dark:text-white">
                                            {new Date(invoice.dueDate).toLocaleDateString()}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleViewInvoice(invoice.id)}
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                title="View"
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDownloadInvoice(invoice.id)}
                                                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                                                title="Download"
                                            >
                                                <ArrowDownTrayIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEditInvoice(invoice.id)}
                                                className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300"
                                                title="Edit"
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteInvoice(invoice.id)}
                                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                                title="Delete"
                                            >
                                                <TrashIcon className="w-4 h-4" />
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

export default Invoices;
