import {
    BellIcon,
    BuildingOfficeIcon,
    CameraIcon,
    ChartBarIcon,
    ClockIcon,
    CogIcon,
    EnvelopeIcon,
    EyeIcon,
    EyeSlashIcon,
    GlobeAltIcon,
    LockClosedIcon,
    MapPinIcon,
    PencilIcon,
    PhoneIcon,
    ShieldCheckIcon,
    UserIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';

interface UserProfile {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar: string;
    bio: string;
    location: string;
    website: string;
    company: string;
    position: string;
    joinDate: string;
    lastActive: string;
    timezone: string;
    language: string;
    notifications: {
        email: boolean;
        push: boolean;
        sms: boolean;
        marketing: boolean;
    };
    privacy: {
        profileVisibility: string;
        showEmail: boolean;
        showPhone: boolean;
        showLocation: boolean;
    };
}

interface Activity {
    id: number;
    type: 'login' | 'profile_update' | 'password_change' | 'settings_update';
    description: string;
    timestamp: string;
    ip: string;
    location: string;
}

const Profile: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'security' | 'activity'>('overview');
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [profile, setProfile] = useState<UserProfile>({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        bio: 'Full-stack developer with 5+ years of experience in React, Node.js, and cloud technologies. Passionate about creating scalable and user-friendly applications.',
        location: 'San Francisco, CA',
        website: 'https://johndoe.dev',
        company: 'Tech Solutions Inc.',
        position: 'Senior Software Engineer',
        joinDate: '2023-01-15',
        lastActive: '2024-01-20 14:30',
        timezone: 'Pacific Standard Time (PST)',
        language: 'English',
        notifications: {
            email: true,
            push: true,
            sms: false,
            marketing: false,
        },
        privacy: {
            profileVisibility: 'public',
            showEmail: false,
            showPhone: false,
            showLocation: true,
        },
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [activities] = useState<Activity[]>([
        {
            id: 1,
            type: 'login',
            description: 'Logged in from Chrome on Windows',
            timestamp: '2024-01-20 14:30',
            ip: '192.168.1.100',
            location: 'San Francisco, CA',
        },
        {
            id: 2,
            type: 'profile_update',
            description: 'Updated profile information',
            timestamp: '2024-01-19 10:15',
            ip: '192.168.1.100',
            location: 'San Francisco, CA',
        },
        {
            id: 3,
            type: 'password_change',
            description: 'Changed password',
            timestamp: '2024-01-18 16:45',
            ip: '192.168.1.100',
            location: 'San Francisco, CA',
        },
        {
            id: 4,
            type: 'settings_update',
            description: 'Updated notification preferences',
            timestamp: '2024-01-17 09:20',
            ip: '192.168.1.100',
            location: 'San Francisco, CA',
        },
    ]);

    const handleInputChange = (field: string, value: any) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const handleNestedInputChange = (parent: string, field: string, value: any) => {
        setProfile(prev => ({
            ...prev,
            [parent]: {
                ...(prev[parent as keyof typeof prev] as Record<string, any>),
                [field]: value,
            },
        }));
    };

    const handlePasswordChange = (field: string, value: string) => {
        setPasswordData(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveProfile = () => {
        console.log('Profile saved:', profile);
        setIsEditing(false);
        alert('Profile updated successfully!');
    };

    const handleChangePassword = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('New passwords do not match!');
            return;
        }
        console.log('Password changed:', passwordData);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        alert('Password changed successfully!');
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'login':
                return <UserIcon className="h-5 w-5 text-blue-500" />;
            case 'profile_update':
                return <PencilIcon className="h-5 w-5 text-green-500" />;
            case 'password_change':
                return <LockClosedIcon className="h-5 w-5 text-red-500" />;
            case 'settings_update':
                return <CogIcon className="h-5 w-5 text-purple-500" />;
            default:
                return <ClockIcon className="h-5 w-5 text-gray-500" />;
        }
    };

    const tabs = [
        { id: 'overview', name: 'Overview', icon: UserIcon },
        { id: 'settings', name: 'Settings', icon: CogIcon },
        { id: 'security', name: 'Security', icon: ShieldCheckIcon },
        { id: 'activity', name: 'Activity', icon: ChartBarIcon },
    ];

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {/* Page Header */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-black dark:text-white">
                        User Profile
                    </h2>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        Manage your profile information, settings, and security preferences.
                    </p>
                </div>
                {activeTab === 'overview' && (
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-xs font-medium text-white shadow-theme-xs hover:bg-primary-600 transition-all duration-200"
                    >
                        {isEditing ? (
                            <>
                                <XMarkIcon className="w-4 h-4" />
                                Cancel
                            </>
                        ) : (
                            <>
                                <PencilIcon className="w-4 h-4" />
                                Edit Profile
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Profile Header */}
            <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex flex-col items-center text-center sm:flex-row sm:text-left">
                    <div className="relative mb-4 sm:mb-0 sm:mr-6">
                        <img
                            src={profile.avatar}
                            alt="Profile"
                            className="h-24 w-24 rounded-full object-cover"
                        />
                        {isEditing && (
                            <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors">
                                <CameraIcon className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {profile.firstName} {profile.lastName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {profile.position} at {profile.company}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            Member since {new Date(profile.joinDate).toLocaleDateString()}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                                <MapPinIcon className="h-3 w-3" />
                                {profile.location}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-300">
                                <ClockIcon className="h-3 w-3" />
                                Last active: {profile.lastActive}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex items-center gap-2 border-b-2 py-2 px-1 text-xs font-medium transition-colors ${activeTab === tab.id
                                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {tab.name}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Tab Content */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Profile Information
                        </h3>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* First Name */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    First Name
                                </label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={profile.firstName}
                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full rounded-lg border border-gray-200 pl-10 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                                    />
                                </div>
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Last Name
                                </label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={profile.lastName}
                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full rounded-lg border border-gray-200 pl-10 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Email
                                </label>
                                <div className="relative">
                                    <EnvelopeIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full rounded-lg border border-gray-200 pl-10 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Phone
                                </label>
                                <div className="relative">
                                    <PhoneIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="tel"
                                        value={profile.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full rounded-lg border border-gray-200 pl-10 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                                    />
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Location
                                </label>
                                <div className="relative">
                                    <MapPinIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={profile.location}
                                        onChange={(e) => handleInputChange('location', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full rounded-lg border border-gray-200 pl-10 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                                    />
                                </div>
                            </div>

                            {/* Website */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Website
                                </label>
                                <div className="relative">
                                    <GlobeAltIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="url"
                                        value={profile.website}
                                        onChange={(e) => handleInputChange('website', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full rounded-lg border border-gray-200 pl-10 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                                    />
                                </div>
                            </div>

                            {/* Company */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Company
                                </label>
                                <div className="relative">
                                    <BuildingOfficeIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={profile.company}
                                        onChange={(e) => handleInputChange('company', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full rounded-lg border border-gray-200 pl-10 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                                    />
                                </div>
                            </div>

                            {/* Position */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Position
                                </label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={profile.position}
                                        onChange={(e) => handleInputChange('position', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full rounded-lg border border-gray-200 pl-10 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Bio
                            </label>
                            <textarea
                                value={profile.bio}
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                disabled={!isEditing}
                                rows={4}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                                placeholder="Tell us about yourself..."
                            />
                        </div>

                        {isEditing && (
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveProfile}
                                    className="rounded-lg bg-primary-500 px-4 py-2 text-xs font-medium text-white hover:bg-primary-600 transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Account Settings
                        </h3>

                        {/* General Settings */}
                        <div>
                            <h4 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">General</h4>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                        Timezone
                                    </label>
                                    <select
                                        value={profile.timezone}
                                        onChange={(e) => handleInputChange('timezone', e.target.value)}
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="Pacific Standard Time (PST)">Pacific Standard Time (PST)</option>
                                        <option value="Eastern Standard Time (EST)">Eastern Standard Time (EST)</option>
                                        <option value="Central Standard Time (CST)">Central Standard Time (CST)</option>
                                        <option value="Mountain Standard Time (MST)">Mountain Standard Time (MST)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                        Language
                                    </label>
                                    <select
                                        value={profile.language}
                                        onChange={(e) => handleInputChange('language', e.target.value)}
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="English">English</option>
                                        <option value="Spanish">Spanish</option>
                                        <option value="French">French</option>
                                        <option value="German">German</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Notifications */}
                        <div>
                            <h4 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">Notifications</h4>
                            <div className="space-y-3">
                                <label className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <BellIcon className="h-4 w-4 text-gray-400" />
                                        <span className="text-xs text-gray-700 dark:text-gray-300">Email Notifications</span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={profile.notifications.email}
                                        onChange={(e) => handleNestedInputChange('notifications', 'email', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </label>
                                <label className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <BellIcon className="h-4 w-4 text-gray-400" />
                                        <span className="text-xs text-gray-700 dark:text-gray-300">Push Notifications</span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={profile.notifications.push}
                                        onChange={(e) => handleNestedInputChange('notifications', 'push', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </label>
                                <label className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <BellIcon className="h-4 w-4 text-gray-400" />
                                        <span className="text-xs text-gray-700 dark:text-gray-300">SMS Notifications</span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={profile.notifications.sms}
                                        onChange={(e) => handleNestedInputChange('notifications', 'sms', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </label>
                                <label className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <BellIcon className="h-4 w-4 text-gray-400" />
                                        <span className="text-xs text-gray-700 dark:text-gray-300">Marketing Emails</span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={profile.notifications.marketing}
                                        onChange={(e) => handleNestedInputChange('notifications', 'marketing', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Privacy */}
                        <div>
                            <h4 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">Privacy</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                        Profile Visibility
                                    </label>
                                    <select
                                        value={profile.privacy.profileVisibility}
                                        onChange={(e) => handleNestedInputChange('privacy', 'profileVisibility', e.target.value)}
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                        <option value="friends">Friends Only</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="flex items-center justify-between">
                                        <span className="text-xs text-gray-700 dark:text-gray-300">Show Email</span>
                                        <input
                                            type="checkbox"
                                            checked={profile.privacy.showEmail}
                                            onChange={(e) => handleNestedInputChange('privacy', 'showEmail', e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between">
                                        <span className="text-xs text-gray-700 dark:text-gray-300">Show Phone</span>
                                        <input
                                            type="checkbox"
                                            checked={profile.privacy.showPhone}
                                            onChange={(e) => handleNestedInputChange('privacy', 'showPhone', e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between">
                                        <span className="text-xs text-gray-700 dark:text-gray-300">Show Location</span>
                                        <input
                                            type="checkbox"
                                            checked={profile.privacy.showLocation}
                                            onChange={(e) => handleNestedInputChange('privacy', 'showLocation', e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Security Settings
                        </h3>

                        {/* Change Password */}
                        <div>
                            <h4 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">Change Password</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <LockClosedIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            value={passwordData.currentPassword}
                                            onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                            className="w-full rounded-lg border border-gray-200 pl-10 pr-10 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            placeholder="Enter current password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                        >
                                            {showCurrentPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <LockClosedIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            value={passwordData.newPassword}
                                            onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                            className="w-full rounded-lg border border-gray-200 pl-10 pr-10 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            placeholder="Enter new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                        >
                                            {showNewPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <LockClosedIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                            className="w-full rounded-lg border border-gray-200 pl-10 pr-10 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            placeholder="Confirm new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                        >
                                            {showConfirmPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleChangePassword}
                                    className="rounded-lg bg-primary-500 px-4 py-2 text-xs font-medium text-white hover:bg-primary-600 transition-colors"
                                >
                                    Change Password
                                </button>
                            </div>
                        </div>

                        {/* Two-Factor Authentication */}
                        <div>
                            <h4 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-600">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Authenticator App</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Use an authenticator app to generate verification codes</p>
                                    </div>
                                    <button className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-600 transition-colors">
                                        Enable
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'activity' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Account Activity
                        </h3>

                        <div className="space-y-4">
                            {activities.map((activity) => (
                                <div key={activity.id} className="flex items-start space-x-3 rounded-lg border border-gray-200 p-4 dark:border-gray-600">
                                    <div className="flex-shrink-0">
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {activity.description}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {activity.timestamp} • {activity.location}
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">
                                            IP: {activity.ip}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
