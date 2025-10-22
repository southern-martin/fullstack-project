import {
    CalendarIcon,
    CheckCircleIcon,
    EnvelopeIcon,
    PencilIcon,
    PlusIcon,
    ShieldCheckIcon,
    UserIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import Button from '../../../shared/components/ui/Button';
import Tabs from '../../../shared/components/ui/Tabs';
import { CreateProfileRequest, UpdateProfileRequest, User, UserProfile } from '../../../shared/types';
import { useProfileLabels } from '../hooks/useProfileLabels';
import { useUserLabels } from '../hooks/useUserLabels';
import { profileApiService } from '../services/profileApiService';
import { UserProfileForm } from './UserProfileForm';
import { UserProfileView } from './UserProfileView';

interface UserDetailsProps {
    user: User;
    onClose: () => void;
}

const UserDetails: React.FC<UserDetailsProps> = ({ user, onClose }) => {
    const { L } = useProfileLabels();
    const { L: userL } = useUserLabels();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);

    // Load profile when component mounts or user changes
    const loadProfile = useCallback(async () => {
        setIsLoadingProfile(true);
        try {
            const userProfile = await profileApiService.getProfileByUserId(user.id);
            setProfile(userProfile);
        } catch (error) {
            console.error('Error loading profile:', error);
            // Don't show error toast - it's normal to not have a profile yet
        } finally {
            setIsLoadingProfile(false);
        }
    }, [user.id]);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const handleProfileSubmit = useCallback(async (profileData: CreateProfileRequest | UpdateProfileRequest) => {
        try {
            let updatedProfile: UserProfile;
            
            // Use create or update based on whether profile exists
            if (profile) {
                updatedProfile = await profileApiService.updateProfile(user.id, profileData);
                toast.success(L.messages.updateSuccess);
            } else {
                updatedProfile = await profileApiService.createProfile(user.id, profileData);
                toast.success(L.messages.createSuccess);
            }
            
            setProfile(updatedProfile);
            setIsEditingProfile(false);
        } catch (error) {
            console.error('Error saving profile:', error);
            toast.error(L.messages.saveError);
            throw error; // Re-throw so the form can handle validation errors
        }
    }, [user.id, profile, L.messages]);

    const handleCancelEdit = useCallback(() => {
        setIsEditingProfile(false);
    }, []);

    const handleStartEdit = useCallback(() => {
        setIsEditingProfile(true);
    }, []);

    // User Details Tab Content
    const detailsTabContent = (
        <div>
            <div className="flex items-center space-x-4 mb-6">
                <div className="flex-shrink-0">
                    <div className="h-16 w-16 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <span className="text-xl font-medium text-gray-700 dark:text-gray-300">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </span>
                    </div>
                </div>
                <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
                <div className="flex-shrink-0">
                    {user.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                            Active
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400">
                            <XCircleIcon className="h-3 w-3 mr-1" />
                            Inactive
                        </span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
                        <UserIcon className="h-5 w-5 mr-2" />
                        {userL.details.personalInfo}
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{userL.details.firstName}</label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{user.firstName}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{userL.details.lastName}</label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{user.lastName}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{userL.details.email}</label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 flex items-center">
                                <EnvelopeIcon className="h-4 w-4 mr-1" />
                                {user.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Account Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
                        <ShieldCheckIcon className="h-5 w-5 mr-2" />
                        {userL.details.accountInfo}
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{userL.details.userId}</label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">#{user.id}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{userL.details.status}</label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                {user.isActive ? userL.status.active : userL.status.inactive}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{userL.details.created}</label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 flex items-center">
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
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{userL.details.lastUpdated}</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 flex items-center">
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
        </div>
    );

    // Roles & Permissions Tab Content
    const rolesTabContent = (
        <div>
            <div className="flex items-center mb-6">
                <ShieldCheckIcon className="h-6 w-6 mr-2 text-gray-700 dark:text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{userL.details.rolesPermissions}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
                {user.roles && user.roles.length > 0 ? (
                    user.roles.map((role) => (
                        <span
                            key={role.id}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400"
                        >
                            {role.name}
                        </span>
                    ))
                ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{userL.details.noRoles}</p>
                )}
            </div>
        </div>
    );

    // Profile Tab Content
    const profileTabContent = (
        <div>
            {isLoadingProfile ? (
                <div className="flex items-center justify-center py-12">
                    <div className="text-gray-500 dark:text-gray-400">{L.messages.loadingProfile}</div>
                </div>
            ) : profile && !isEditingProfile ? (
                <div>
                    <div className="flex justify-end mb-4">
                        <Button
                            variant="secondary"
                            onClick={handleStartEdit}
                            className="flex items-center space-x-2"
                        >
                            <PencilIcon className="h-4 w-4" />
                            <span>{L.actions.editProfile}</span>
                        </Button>
                    </div>
                    <UserProfileView profile={profile} />
                </div>
            ) : isEditingProfile ? (
                <UserProfileForm
                    userId={user.id}
                    profile={profile || undefined}
                    onSubmit={handleProfileSubmit}
                    onCancel={handleCancelEdit}
                />
            ) : (
                <div className="flex flex-col items-center justify-center py-12">
                    <UserIcon className="h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">{L.messages.noProfile}</p>
                    <Button
                        onClick={handleStartEdit}
                        className="flex items-center space-x-2"
                    >
                        <PlusIcon className="h-4 w-4" />
                        <span>{L.actions.createProfile}</span>
                    </Button>
                </div>
            )}
        </div>
    );

    return (
        <div className="p-6">
            <Tabs
                tabs={[
                    {
                        id: 'details',
                        label: L.tabs.details,
                        content: detailsTabContent
                    },
                    {
                        id: 'roles',
                        label: L.tabs.roles,
                        content: rolesTabContent
                    },
                    {
                        id: 'profile',
                        label: L.tabs.profile,
                        content: profileTabContent
                    }
                ]}
                defaultTab="details"
            />

            {/* Actions */}
            <div className="mt-8 flex justify-end border-t pt-4 border-gray-200 dark:border-gray-700">
                <Button
                    variant="secondary"
                    onClick={onClose}
                >
                    {L.actions.close}
                </Button>
            </div>
        </div>
    );
};

export default UserDetails;
