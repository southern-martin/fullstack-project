import {
    CalendarIcon,
    CheckCircleIcon,
    EnvelopeIcon,
    PhoneIcon,
    TruckIcon,
    UserIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import React from 'react';

import Button from '../../../shared/components/ui/Button';
import { Carrier } from '../services/carrierApiService';

interface CarrierDetailsProps {
    carrier: Carrier;
    onClose: () => void;
}

const CarrierDetails: React.FC<CarrierDetailsProps> = ({ carrier, onClose }) => {

    return (
        <div className="p-6">
            <div className="flex items-center space-x-4 mb-6">
                <div className="flex-shrink-0">
                    <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                        <TruckIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                </div>
                <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {carrier.name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{carrier.metadata?.code || '-'}</p>
                </div>
                <div className="flex-shrink-0">
                    {carrier.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                            {'Active'}
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400">
                            <XCircleIcon className="h-3 w-3 mr-1" />
                            {'Inactive'}
                        </span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Carrier Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
                        <TruckIcon className="h-5 w-5 mr-2" />
                        {'Carrier Information'}
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{'Name'}</label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{carrier.name}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{'Code'}</label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 font-mono">{carrier.metadata?.code || '-'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{'Description'}</label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                {carrier.description || 'No description provided'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
                        <UserIcon className="h-5 w-5 mr-2" />
                        {'Contact Information'}
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{'Contact Email'}</label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 flex items-center">
                                <EnvelopeIcon className="h-4 w-4 mr-1" />
                                {carrier.contactEmail || 'Not provided'}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{'Contact Phone'}</label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 flex items-center">
                                <PhoneIcon className="h-4 w-4 mr-1" />
                                {carrier.contactPhone || 'Not provided'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Information */}
            <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center mb-4">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    {'Account Information'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{'Carrier ID'}</label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">#{carrier.id}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{'Status'}</label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                            {carrier.isActive ? 'Active' : 'Inactive'}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{'Created'}</label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {new Date(carrier.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>
                    {carrier.updatedAt && (
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{'Last Updated'}</label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 flex items-center">
                                <CalendarIcon className="h-4 w-4 mr-1" />
                                {new Date(carrier.updatedAt).toLocaleDateString('en-US', {
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

            {/* Actions */}
            <div className="mt-8 flex justify-end">
                <Button
                    variant="secondary"
                    onClick={onClose}
                >
                    {'Close'}
                </Button>
            </div>
        </div>
    );
};

export default CarrierDetails;
