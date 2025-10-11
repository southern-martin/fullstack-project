import {
    BellIcon,
    CogIcon,
    DocumentTextIcon,
    GlobeAltIcon,
    KeyIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import { FormField } from '../../../shared/components/ui/FormField';

interface SettingsData {
    general: {
        companyName: string;
        companyEmail: string;
        timezone: string;
        dateFormat: string;
    };
    notifications: {
        emailNotifications: boolean;
        pushNotifications: boolean;
        smsNotifications: boolean;
        weeklyReports: boolean;
    };
    security: {
        twoFactorAuth: boolean;
        sessionTimeout: number;
        passwordExpiry: number;
    };
    appearance: {
        theme: 'light' | 'dark' | 'auto';
        language: string;
        sidebarCollapsed: boolean;
    };
}

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [settings, setSettings] = useState<SettingsData>({
        general: {
            companyName: 'Your Company',
            companyEmail: 'admin@company.com',
            timezone: 'UTC',
            dateFormat: 'MM/DD/YYYY'
        },
        notifications: {
            emailNotifications: true,
            pushNotifications: true,
            smsNotifications: false,
            weeklyReports: true
        },
        security: {
            twoFactorAuth: false,
            sessionTimeout: 30,
            passwordExpiry: 90
        },
        appearance: {
            theme: 'light',
            language: 'en',
            sidebarCollapsed: false
        }
    });
    const [isSaving, setIsSaving] = useState(false);

    const tabs = [
        { id: 'general', name: 'General', icon: CogIcon },
        { id: 'notifications', name: 'Notifications', icon: BellIcon },
        { id: 'security', name: 'Security', icon: ShieldCheckIcon },
        { id: 'appearance', name: 'Appearance', icon: GlobeAltIcon }
    ];

    const handleInputChange = (section: keyof SettingsData, field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Settings saved successfully');
        } catch (error) {
            toast.error('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    const renderGeneralSettings = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    label={'Company Name'}
                    name="companyName"
                    value={settings.general.companyName}
                    onChange={handleInputChange('general', 'companyName')}
                    placeholder={'Enter company name'}
                />

                <FormField
                    label={'Company Email'}
                    name="companyEmail"
                    type="email"
                    value={settings.general.companyEmail}
                    onChange={handleInputChange('general', 'companyEmail')}
                    placeholder={'Enter company email'}
                />

                <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
                        {'Timezone'}
                    </label>
                    <select
                        id="timezone"
                        value={settings.general.timezone}
                        onChange={handleInputChange('general', 'timezone')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="Europe/London">London</option>
                        <option value="Europe/Paris">Paris</option>
                        <option value="Asia/Tokyo">Tokyo</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 mb-2">
                        {'Date Format'}
                    </label>
                    <select
                        id="dateFormat"
                        value={settings.general.dateFormat}
                        onChange={handleInputChange('general', 'dateFormat')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderNotificationSettings = () => (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-medium text-gray-900">{'Email Notifications'}</h4>
                        <p className="text-sm text-gray-500">{'Receive notifications via email'}</p>
                    </div>
                    <input
                        type="checkbox"
                        checked={settings.notifications.emailNotifications}
                        onChange={handleInputChange('notifications', 'emailNotifications')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-medium text-gray-900">{'Push Notifications'}</h4>
                        <p className="text-sm text-gray-500">{'Receive push notifications in browser'}</p>
                    </div>
                    <input
                        type="checkbox"
                        checked={settings.notifications.pushNotifications}
                        onChange={handleInputChange('notifications', 'pushNotifications')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-medium text-gray-900">{'SMS Notifications'}</h4>
                        <p className="text-sm text-gray-500">{'Receive notifications via SMS'}</p>
                    </div>
                    <input
                        type="checkbox"
                        checked={settings.notifications.smsNotifications}
                        onChange={handleInputChange('notifications', 'smsNotifications')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-medium text-gray-900">{'Weekly Reports'}</h4>
                        <p className="text-sm text-gray-500">{'Receive weekly summary reports'}</p>
                    </div>
                    <input
                        type="checkbox"
                        checked={settings.notifications.weeklyReports}
                        onChange={handleInputChange('notifications', 'weeklyReports')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                </div>
            </div>
        </div>
    );

    const renderSecuritySettings = () => (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-medium text-gray-900">{'Two-Factor Authentication'}</h4>
                        <p className="text-sm text-gray-500">{'Add an extra layer of security to your account'}</p>
                    </div>
                    <input
                        type="checkbox"
                        checked={settings.security.twoFactorAuth}
                        onChange={handleInputChange('security', 'twoFactorAuth')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                </div>

                <div>
                    <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700 mb-2">
                        {'Session Timeout (minutes)'}
                    </label>
                    <input
                        type="number"
                        id="sessionTimeout"
                        value={settings.security.sessionTimeout}
                        onChange={handleInputChange('security', 'sessionTimeout')}
                        min="5"
                        max="480"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label htmlFor="passwordExpiry" className="block text-sm font-medium text-gray-700 mb-2">
                        {'Password Expiry (days)'}
                    </label>
                    <input
                        type="number"
                        id="passwordExpiry"
                        value={settings.security.passwordExpiry}
                        onChange={handleInputChange('security', 'passwordExpiry')}
                        min="30"
                        max="365"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>
        </div>
    );

    const renderAppearanceSettings = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-2">
                        {'Theme'}
                    </label>
                    <select
                        id="theme"
                        value={settings.appearance.theme}
                        onChange={handleInputChange('appearance', 'theme')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="light">{'Light'}</option>
                        <option value="dark">{'Dark'}</option>
                        <option value="auto">{'Auto'}</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                        {'Language'}
                    </label>
                    <select
                        id="language"
                        value={settings.appearance.language}
                        onChange={handleInputChange('appearance', 'language')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="en">{'English'}</option>
                        <option value="fr">{'French'}</option>
                        <option value="es">{'Spanish'}</option>
                        <option value="de">{'German'}</option>
                    </select>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-medium text-gray-900">{'Collapse Sidebar'}</h4>
                    <p className="text-sm text-gray-500">{'Start with sidebar collapsed'}</p>
                </div>
                <input
                    type="checkbox"
                    checked={settings.appearance.sidebarCollapsed}
                    onChange={handleInputChange('appearance', 'sidebarCollapsed')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
            </div>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return renderGeneralSettings();
            case 'notifications':
                return renderNotificationSettings();
            case 'security':
                return renderSecuritySettings();
            case 'appearance':
                return renderAppearanceSettings();
            default:
                return renderGeneralSettings();
        }
    };

    return (
        <div>
            {/* Page Header */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{'Settings'}</h1>
                    <p className="text-sm text-gray-600">{'Manage your application preferences and configuration'}</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" className="flex items-center gap-2">
                        <DocumentTextIcon className="h-4 w-4" />
                        {'Export Settings'}
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                {'Saving...'}
                            </>
                        ) : (
                            <>
                                <KeyIcon className="h-4 w-4" />
                                {'Save Changes'}
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Settings Navigation */}
                <div className="lg:col-span-1">
                    <Card>
                        <div className="p-6">
                            <nav className="space-y-2">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.id
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                                }`}
                                        >
                                            <Icon className="h-5 w-5 mr-3" />
                                            {tab.name}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </Card>
                </div>

                {/* Settings Content */}
                <div className="lg:col-span-3">
                    <Card>
                        <div className="p-6">
                            <div className="mb-6">
                                <h2 className="text-lg font-medium text-gray-900">
                                    {tabs.find(tab => tab.id === activeTab)?.name}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {activeTab === 'general' && 'Configure general application settings'}
                                    {activeTab === 'notifications' && 'Manage notification preferences'}
                                    {activeTab === 'security' && 'Configure security and privacy settings'}
                                    {activeTab === 'appearance' && 'Customize the look and feel of the application'}
                                </p>
                            </div>
                            {renderTabContent()}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Settings;
