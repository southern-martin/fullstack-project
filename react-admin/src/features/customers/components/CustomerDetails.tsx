import {
    CalendarIcon,
    CheckCircleIcon,
    EnvelopeIcon,
    MapPinIcon,
    PhoneIcon,
    UserIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import React from 'react';

import Button from '../../../shared/components/ui/Button';
import { Customer } from '../services/customerApiService';
import { useCustomerLabels } from '../hooks/useCustomerLabels';

interface CustomerDetailsProps {
    customer: Customer;
    onClose: () => void;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({ customer, onClose }) => {
    // Translation hook
    const { labels: L } = useCustomerLabels();

    return (
        <div className="p-6">
            <div className="flex items-center space-x-4 mb-6">
                <div className="flex-shrink-0">
                    <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                        <span className="text-xl font-medium text-blue-800 dark:text-blue-400">
                            {customer.firstName.charAt(0).toUpperCase()}
                        </span>
                    </div>
                </div>
                <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {customer.firstName} {customer.lastName}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{customer.email}</p>
                </div>
                <div className="flex-shrink-0">
                    {customer.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                            {L.STATUS_ACTIVE}
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400">
                            <XCircleIcon className="h-3 w-3 mr-1" />
                            {L.STATUS_INACTIVE}
                        </span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
                        <UserIcon className="h-5 w-5 mr-2" />
                        {L.SECTION_CONTACT_INFO}
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{L.LABEL_NAME}</label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{customer.firstName} {customer.lastName}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{L.LABEL_EMAIL}</label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 flex items-center">
                                <EnvelopeIcon className="h-4 w-4 mr-1" />
                                {customer.email}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{L.LABEL_PHONE}</label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 flex items-center">
                                <PhoneIcon className="h-4 w-4 mr-1" />
                                {customer.phone || L.NOT_PROVIDED}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{L.LABEL_ADDRESS}</label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 flex items-center">
                                <MapPinIcon className="h-4 w-4 mr-1" />
                                {customer.address ? `${customer.address.street}, ${customer.address.city}, ${customer.address.state} ${customer.address.zipCode}` : L.NOT_PROVIDED}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Account Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
                        <CalendarIcon className="h-5 w-5 mr-2" />
                        {L.SECTION_ACCOUNT_INFO}
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{L.LABEL_CUSTOMER_ID}</label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">#{customer.id}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{L.LABEL_STATUS}</label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                {customer.isActive ? L.STATUS_ACTIVE : L.STATUS_INACTIVE}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{L.LABEL_CREATED}</label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 flex items-center">
                                <CalendarIcon className="h-4 w-4 mr-1" />
                                {new Date(customer.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                        {customer.updatedAt && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{L.LABEL_LAST_UPDATED}</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 flex items-center">
                                    <CalendarIcon className="h-4 w-4 mr-1" />
                                    {new Date(customer.updatedAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex justify-end">
                <Button
                    variant="secondary"
                    onClick={onClose}
                >
                    {L.BUTTON_CLOSE}
                </Button>
            </div>
        </div>
    );
};

export default CustomerDetails;
