import {
    ArrowDownTrayIcon,
    ArrowLeftIcon,
    PencilIcon,
    PrinterIcon,
    ShareIcon,
} from '@heroicons/react/24/outline';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface InvoiceItem {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}

interface Invoice {
    id: number;
    invoiceNumber: string;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    issueDate: string;
    dueDate: string;
    client: {
        name: string;
        email: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    company: {
        name: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    items: InvoiceItem[];
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    total: number;
    notes: string;
}

const SingleInvoice: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Mock invoice data - in real app, this would be fetched based on the ID
    const invoice: Invoice = {
        id: 1,
        invoiceNumber: 'INV-001',
        status: 'paid',
        issueDate: '2024-01-15',
        dueDate: '2024-02-15',
        client: {
            name: 'Acme Corporation',
            email: 'billing@acme.com',
            address: '123 Business Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States',
        },
        company: {
            name: 'Your Company Name',
            email: 'billing@yourcompany.com',
            phone: '+1 (555) 123-4567',
            address: '456 Company Avenue',
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94105',
            country: 'United States',
        },
        items: [
            {
                description: 'Website Development - Homepage',
                quantity: 1,
                rate: 1500.00,
                amount: 1500.00,
            },
            {
                description: 'Website Development - About Page',
                quantity: 1,
                rate: 500.00,
                amount: 500.00,
            },
            {
                description: 'Website Development - Contact Page',
                quantity: 1,
                rate: 500.00,
                amount: 500.00,
            },
        ],
        subtotal: 2500.00,
        taxRate: 0.08,
        taxAmount: 200.00,
        total: 2700.00,
        notes: 'Thank you for your business! Payment is due within 30 days of invoice date.',
    };

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

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        console.log('Download invoice');
    };

    const handleEdit = () => {
        console.log('Edit invoice');
    };

    const handleShare = () => {
        console.log('Share invoice');
    };

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {/* Page Header */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/invoices')}
                        className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                        <ArrowLeftIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                    <div>
                        <h2 className="text-lg font-semibold text-black dark:text-white">
                            Invoice {invoice.invoiceNumber}
                        </h2>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            View and manage invoice details
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleShare}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                    >
                        <ShareIcon className="w-4 h-4" />
                        Share
                    </button>
                    <button
                        onClick={handlePrint}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                    >
                        <PrinterIcon className="w-4 h-4" />
                        Print
                    </button>
                    <button
                        onClick={handleDownload}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                    >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                        Download
                    </button>
                    <button
                        onClick={handleEdit}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-xs font-medium text-white shadow-theme-xs hover:bg-primary-600 transition-all duration-200"
                    >
                        <PencilIcon className="w-4 h-4" />
                        Edit
                    </button>
                </div>
            </div>

            {/* Invoice Details */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] sm:p-8">
                {/* Invoice Header */}
                <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {invoice.company.name}
                        </h1>
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <p>{invoice.company.address}</p>
                            <p>{invoice.company.city}, {invoice.company.state} {invoice.company.zipCode}</p>
                            <p>{invoice.company.country}</p>
                            <p className="mt-1">{invoice.company.email}</p>
                            <p>{invoice.company.phone}</p>
                        </div>
                    </div>

                    <div className="text-right">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">INVOICE</h2>
                        <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <p><span className="font-medium">Invoice #:</span> {invoice.invoiceNumber}</p>
                            <p><span className="font-medium">Issue Date:</span> {new Date(invoice.issueDate).toLocaleDateString()}</p>
                            <p><span className="font-medium">Due Date:</span> {new Date(invoice.dueDate).toLocaleDateString()}</p>
                            <p className="mt-3">
                                <span className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-xs font-medium ${getStatusColor(invoice.status)}`}>
                                    {invoice.status.toUpperCase()}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bill To */}
                <div className="mb-8">
                    <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Bill To:</h3>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p className="font-medium text-gray-900 dark:text-white">{invoice.client.name}</p>
                        <p>{invoice.client.email}</p>
                        <p>{invoice.client.address}</p>
                        <p>{invoice.client.city}, {invoice.client.state} {invoice.client.zipCode}</p>
                        <p>{invoice.client.country}</p>
                    </div>
                </div>

                {/* Invoice Items */}
                <div className="mb-8">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="pb-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                        Description
                                    </th>
                                    <th className="pb-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                                        Quantity
                                    </th>
                                    <th className="pb-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                                        Rate
                                    </th>
                                    <th className="pb-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                                        Amount
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.items.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                                        <td className="py-3 text-sm text-gray-900 dark:text-white">
                                            {item.description}
                                        </td>
                                        <td className="py-3 text-right text-sm text-gray-600 dark:text-gray-400">
                                            {item.quantity}
                                        </td>
                                        <td className="py-3 text-right text-sm text-gray-600 dark:text-gray-400">
                                            ${item.rate.toFixed(2)}
                                        </td>
                                        <td className="py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                                            ${item.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Invoice Totals */}
                <div className="mb-8">
                    <div className="ml-auto max-w-xs">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                                <span className="text-gray-900 dark:text-white">${invoice.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Tax ({(invoice.taxRate * 100).toFixed(0)}%):</span>
                                <span className="text-gray-900 dark:text-white">${invoice.taxAmount.toFixed(2)}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-2 dark:border-gray-700">
                                <div className="flex justify-between">
                                    <span className="text-base font-semibold text-gray-900 dark:text-white">Total:</span>
                                    <span className="text-base font-semibold text-gray-900 dark:text-white">${invoice.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                {invoice.notes && (
                    <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                        <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">Notes:</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.notes}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SingleInvoice;
