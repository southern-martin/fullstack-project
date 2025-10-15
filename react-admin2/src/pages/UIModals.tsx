import {
    CheckIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';

const UIModals: React.FC = () => {
    const [isBasicModalOpen, setIsBasicModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [isLargeModalOpen, setIsLargeModalOpen] = useState(false);
    const [isSmallModalOpen, setIsSmallModalOpen] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '' });

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        setIsFormModalOpen(false);
        setFormData({ name: '', email: '' });
    };

    return (
        <div className="mx-auto max-w-7xl p-6">
            <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">Modals</h1>

            {/* Basic Modal */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Basic Modal</h2>
                <button
                    onClick={() => setIsBasicModalOpen(true)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Open Basic Modal
                </button>

                {isBasicModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Modal</h3>
                                <button
                                    onClick={() => setIsBasicModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>
                            <p className="mb-6 text-gray-600 dark:text-gray-400">
                                This is a basic modal dialog. You can add any content here.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setIsBasicModalOpen(false)}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => setIsBasicModalOpen(false)}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Confirmation Modal</h2>
                <button
                    onClick={() => setIsConfirmModalOpen(true)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                    Delete Item
                </button>

                {isConfirmModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Confirm Action</h3>
                                <button
                                    onClick={() => setIsConfirmModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="mb-6 flex items-center">
                                <ExclamationTriangleIcon className="mr-3 h-8 w-8 text-red-500" />
                                <p className="text-gray-600 dark:text-gray-400">
                                    Are you sure you want to delete this item? This action cannot be undone.
                                </p>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setIsConfirmModalOpen(false)}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => setIsConfirmModalOpen(false)}
                                    className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Alert Modal */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Alert Modal</h2>
                <button
                    onClick={() => setIsAlertModalOpen(true)}
                    className="rounded-lg bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
                >
                    Show Alert
                </button>

                {isAlertModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Alert</h3>
                                <button
                                    onClick={() => setIsAlertModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="mb-6 flex items-center">
                                <InformationCircleIcon className="mr-3 h-8 w-8 text-blue-500" />
                                <p className="text-gray-600 dark:text-gray-400">
                                    This is an important alert message that requires your attention.
                                </p>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setIsAlertModalOpen(false)}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Large Modal */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Large Modal</h2>
                <button
                    onClick={() => setIsLargeModalOpen(true)}
                    className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                    Open Large Modal
                </button>

                {isLargeModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                        <div className="w-full max-w-4xl rounded-lg bg-white shadow-xl dark:bg-gray-800">
                            <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Large Modal</h3>
                                <button
                                    onClick={() => setIsLargeModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="max-h-96 overflow-y-auto p-6">
                                <p className="mb-4 text-gray-600 dark:text-gray-400">
                                    This is a large modal with more content. It can contain forms, tables, or any other content.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                                        <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Section 1</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        </p>
                                    </div>
                                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                                        <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Section 2</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 border-t border-gray-200 p-6 dark:border-gray-700">
                                <button
                                    onClick={() => setIsLargeModalOpen(false)}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => setIsLargeModalOpen(false)}
                                    className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Small Modal */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Small Modal</h2>
                <button
                    onClick={() => setIsSmallModalOpen(true)}
                    className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
                >
                    Open Small Modal
                </button>

                {isSmallModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-xl dark:bg-gray-800">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Small Modal</h3>
                                <button
                                    onClick={() => setIsSmallModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>
                            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                                This is a compact modal for quick actions.
                            </p>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setIsSmallModalOpen(false)}
                                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => setIsSmallModalOpen(false)}
                                    className="rounded-lg bg-purple-600 px-3 py-1.5 text-sm text-white hover:bg-purple-700"
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Form Modal */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Form Modal</h2>
                <button
                    onClick={() => setIsFormModalOpen(true)}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                >
                    Open Form Modal
                </button>

                {isFormModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Item</h3>
                                <button
                                    onClick={() => setIsFormModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>
                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsFormModalOpen(false)}
                                        className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                                    >
                                        <CheckIcon className="mr-2 inline h-4 w-4" />
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UIModals;
