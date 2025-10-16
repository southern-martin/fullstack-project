import {
    ArrowLeftIcon,
    PlusIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface InvoiceItem {
    id: number;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}

interface InvoiceForm {
    clientName: string;
    clientEmail: string;
    clientAddress: string;
    clientCity: string;
    clientState: string;
    clientZipCode: string;
    clientCountry: string;
    issueDate: string;
    dueDate: string;
    taxRate: number;
    notes: string;
    items: InvoiceItem[];
}

const CreateInvoice: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<InvoiceForm>({
        clientName: '',
        clientEmail: '',
        clientAddress: '',
        clientCity: '',
        clientState: '',
        clientZipCode: '',
        clientCountry: 'United States',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        taxRate: 8,
        notes: '',
        items: [
            {
                id: 1,
                description: '',
                quantity: 1,
                rate: 0,
                amount: 0,
            },
        ],
    });
    const [errors, setErrors] = useState<Partial<Omit<InvoiceForm, 'items'> & { items?: string }>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user starts typing
        if (errors[name as keyof InvoiceForm]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const handleItemChange = (id: number, field: keyof InvoiceItem, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.map(item => {
                if (item.id === id) {
                    const updatedItem = { ...item, [field]: value };
                    if (field === 'quantity' || field === 'rate') {
                        updatedItem.amount = updatedItem.quantity * updatedItem.rate;
                    }
                    return updatedItem;
                }
                return item;
            }),
        }));
    };

    const addItem = () => {
        const newId = Math.max(...formData.items.map(item => item.id)) + 1;
        setFormData(prev => ({
            ...prev,
            items: [
                ...prev.items,
                {
                    id: newId,
                    description: '',
                    quantity: 1,
                    rate: 0,
                    amount: 0,
                },
            ],
        }));
    };

    const removeItem = (id: number) => {
        if (formData.items.length > 1) {
            setFormData(prev => ({
                ...prev,
                items: prev.items.filter(item => item.id !== id),
            }));
        }
    };

    const calculateSubtotal = () => {
        return formData.items.reduce((sum, item) => sum + item.amount, 0);
    };

    const calculateTaxAmount = () => {
        return calculateSubtotal() * (formData.taxRate / 100);
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTaxAmount();
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Omit<InvoiceForm, 'items'> & { items?: string }> = {};

        if (!formData.clientName.trim()) {
            newErrors.clientName = 'Client name is required';
        }

        if (!formData.clientEmail.trim()) {
            newErrors.clientEmail = 'Client email is required';
        }

        if (!formData.issueDate) {
            newErrors.issueDate = 'Issue date is required';
        }

        if (!formData.dueDate) {
            newErrors.dueDate = 'Due date is required';
        }

        // Validate items
        const hasEmptyItems = formData.items.some(item =>
            !item.description.trim() || item.quantity <= 0 || item.rate <= 0
        );

        if (hasEmptyItems) {
            newErrors.items = 'All items must have description, quantity, and rate';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            const invoiceData = {
                ...formData,
                subtotal: calculateSubtotal(),
                taxAmount: calculateTaxAmount(),
                total: calculateTotal(),
            };

            console.log('Invoice created:', invoiceData);
            navigate('/invoices');
        } catch (error) {
            console.error('Error creating invoice:', error);
        } finally {
            setIsSubmitting(false);
        }
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
                            Create New Invoice
                        </h2>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            Create a new invoice for your client.
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Client Information */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                    <h3 className="mb-6 text-base font-semibold text-gray-800 dark:text-white/90">
                        Client Information
                    </h3>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Client Name *
                            </label>
                            <input
                                type="text"
                                name="clientName"
                                value={formData.clientName}
                                onChange={handleInputChange}
                                className={`w-full rounded-lg border px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${errors.clientName
                                    ? 'border-red-500 dark:border-red-500'
                                    : 'border-gray-200 dark:border-gray-600'
                                    }`}
                                placeholder="Enter client name"
                            />
                            {errors.clientName && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.clientName}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Client Email *
                            </label>
                            <input
                                type="email"
                                name="clientEmail"
                                value={formData.clientEmail}
                                onChange={handleInputChange}
                                className={`w-full rounded-lg border px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${errors.clientEmail
                                    ? 'border-red-500 dark:border-red-500'
                                    : 'border-gray-200 dark:border-gray-600'
                                    }`}
                                placeholder="Enter client email"
                            />
                            {errors.clientEmail && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.clientEmail}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Address
                            </label>
                            <input
                                type="text"
                                name="clientAddress"
                                value={formData.clientAddress}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                placeholder="Enter address"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                City
                            </label>
                            <input
                                type="text"
                                name="clientCity"
                                value={formData.clientCity}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                placeholder="Enter city"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                State
                            </label>
                            <input
                                type="text"
                                name="clientState"
                                value={formData.clientState}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                placeholder="Enter state"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Zip Code
                            </label>
                            <input
                                type="text"
                                name="clientZipCode"
                                value={formData.clientZipCode}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                placeholder="Enter zip code"
                            />
                        </div>
                    </div>
                </div>

                {/* Invoice Details */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                    <h3 className="mb-6 text-base font-semibold text-gray-800 dark:text-white/90">
                        Invoice Details
                    </h3>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Issue Date *
                            </label>
                            <input
                                type="date"
                                name="issueDate"
                                value={formData.issueDate}
                                onChange={handleInputChange}
                                className={`w-full rounded-lg border px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${errors.issueDate
                                    ? 'border-red-500 dark:border-red-500'
                                    : 'border-gray-200 dark:border-gray-600'
                                    }`}
                            />
                            {errors.issueDate && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.issueDate}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Due Date *
                            </label>
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleInputChange}
                                className={`w-full rounded-lg border px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${errors.dueDate
                                    ? 'border-red-500 dark:border-red-500'
                                    : 'border-gray-200 dark:border-gray-600'
                                    }`}
                            />
                            {errors.dueDate && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.dueDate}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Tax Rate (%)
                            </label>
                            <input
                                type="number"
                                name="taxRate"
                                value={formData.taxRate}
                                onChange={handleInputChange}
                                min="0"
                                max="100"
                                step="0.01"
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Invoice Items */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                            Invoice Items
                        </h3>
                        <button
                            type="button"
                            onClick={addItem}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-3 py-2 text-xs font-medium text-white shadow-theme-xs hover:bg-primary-600 transition-all duration-200"
                        >
                            <PlusIcon className="w-4 h-4" />
                            Add Item
                        </button>
                    </div>

                    <div className="space-y-4">
                        {formData.items.map((item, index) => (
                            <div key={item.id} className="grid grid-cols-1 gap-4 sm:grid-cols-12">
                                <div className="sm:col-span-5">
                                    <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                        Description
                                    </label>
                                    <input
                                        type="text"
                                        value={item.description}
                                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        placeholder="Item description"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                        min="0"
                                        step="0.01"
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                        Rate
                                    </label>
                                    <input
                                        type="number"
                                        value={item.rate}
                                        onChange={(e) => handleItemChange(item.id, 'rate', parseFloat(e.target.value) || 0)}
                                        min="0"
                                        step="0.01"
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                        Amount
                                    </label>
                                    <input
                                        type="number"
                                        value={item.amount.toFixed(2)}
                                        readOnly
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div className="sm:col-span-1 flex items-end">
                                    {formData.items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeItem(item.id)}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {errors.items && (
                        <p className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.items}</p>
                    )}
                </div>

                {/* Invoice Totals */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                    <h3 className="mb-6 text-base font-semibold text-gray-800 dark:text-white/90">
                        Invoice Totals
                    </h3>

                    <div className="ml-auto max-w-xs">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                                <span className="text-gray-900 dark:text-white">${calculateSubtotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Tax ({formData.taxRate}%):</span>
                                <span className="text-gray-900 dark:text-white">${calculateTaxAmount().toFixed(2)}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-2 dark:border-gray-700">
                                <div className="flex justify-between">
                                    <span className="text-base font-semibold text-gray-900 dark:text-white">Total:</span>
                                    <span className="text-base font-semibold text-gray-900 dark:text-white">${calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                    <h3 className="mb-6 text-base font-semibold text-gray-800 dark:text-white/90">
                        Notes
                    </h3>

                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        placeholder="Add any additional notes or terms..."
                    />
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-6 py-2.5 text-xs font-medium text-white shadow-theme-xs hover:bg-primary-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Creating...' : 'Create Invoice'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/invoices')}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-xs font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateInvoice;
