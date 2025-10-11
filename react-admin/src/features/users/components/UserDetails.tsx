import {
    CalendarIcon,
    CheckCircleIcon,
    EnvelopeIcon,
    ShieldCheckIcon,
    UserIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import React from 'react';

import Button from '../../../shared/components/ui/Button';
import { User } from '../../../shared/types';

interface UserDetailsProps {
    user: User;
    onClose: () => void;
}

const UserDetails: React.FC<UserDetailsProps> = ({ user, onClose }) => {

    return (
        <div className="p-6">
            <div className="flex items-center space-x-4 mb-6">
                <div className="flex-shrink-0">
                    <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-xl font-medium text-gray-700">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </span>
                    </div>
                </div>
                <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="flex-shrink-0">
                    {user.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                            Active
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <XCircleIcon className="h-3 w-3 mr-1" />
                            Inactive
                        </span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <UserIcon className="h-5 w-5 mr-2" />
                        Personal Information
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-500">First Name</label>
                            <p className="mt-1 text-sm text-gray-900">{user.firstName}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Last Name</label>
                            <p className="mt-1 text-sm text-gray-900">{user.lastName}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Email</label>
                            <p className="mt-1 text-sm text-gray-900 flex items-center">
                                <EnvelopeIcon className="h-4 w-4 mr-1" />
                                {user.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Account Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <ShieldCheckIcon className="h-5 w-5 mr-2" />
                        Account Information
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-500">User ID</label>
                            <p className="mt-1 text-sm text-gray-900">#{user.id}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Status</label>
                            <p className="mt-1 text-sm text-gray-900">
                                {user.isActive ? 'Active' : 'Inactive'}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Created</label>
                            <p className="mt-1 text-sm text-gray-900 flex items-center">
                                <CalendarIcon className="h-4 w-4 mr-1" />
                                {new Date(user.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                        {user.updatedAt && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                                <p className="mt-1 text-sm text-gray-900 flex items-center">
                                    <CalendarIcon className="h-4 w-4 mr-1" />
                                    {new Date(user.updatedAt).toLocaleDateString('en-US', {
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

            {/* Roles */}
            <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Roles & Permissions</h3>
                <div className="flex flex-wrap gap-2">
                    {user.roles && user.roles.length > 0 ? (
                        user.roles.map((role) => (
                            <span
                                key={role.id}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                            >
                                {role.name}
                            </span>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No roles assigned</p>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex justify-end">
                <Button
                    variant="secondary"
                    onClick={onClose}
                >
                    Close
                </Button>
            </div>
        </div>
    );
};

export default UserDetails;