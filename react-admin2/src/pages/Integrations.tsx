import {
    CheckIcon,
    CogIcon,
    ExclamationTriangleIcon,
    LinkIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    ShieldCheckIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';

interface Integration {
    id: string;
    name: string;
    description: string;
    category: string;
    status: 'connected' | 'available' | 'pending';
    logo: string;
    features: string[];
    setupRequired: boolean;
}

const Integrations: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showConnectedOnly, setShowConnectedOnly] = useState(false);

    const integrations: Integration[] = [
        {
            id: '1',
            name: 'Google Analytics',
            description: 'Track website traffic and user behavior with Google Analytics integration.',
            category: 'Analytics',
            status: 'connected',
            logo: 'https://via.placeholder.com/40x40/4285F4/FFFFFF?text=GA',
            features: ['Page Views', 'User Sessions', 'Conversion Tracking', 'Real-time Data'],
            setupRequired: false
        },
        {
            id: '2',
            name: 'Stripe',
            description: 'Accept payments online with Stripe payment processing.',
            category: 'Payments',
            status: 'connected',
            logo: 'https://via.placeholder.com/40x40/635BFF/FFFFFF?text=ST',
            features: ['Credit Cards', 'Digital Wallets', 'Subscription Billing', 'Fraud Protection'],
            setupRequired: false
        },
        {
            id: '3',
            name: 'Mailchimp',
            description: 'Send marketing emails and manage subscriber lists.',
            category: 'Marketing',
            status: 'available',
            logo: 'https://via.placeholder.com/40x40/FFE01B/000000?text=MC',
            features: ['Email Campaigns', 'Automation', 'Analytics', 'A/B Testing'],
            setupRequired: true
        },
        {
            id: '4',
            name: 'Slack',
            description: 'Get notifications and updates directly in your Slack workspace.',
            category: 'Communication',
            status: 'available',
            logo: 'https://via.placeholder.com/40x40/4A154B/FFFFFF?text=SL',
            features: ['Notifications', 'Team Updates', 'File Sharing', 'Bot Integration'],
            setupRequired: true
        },
        {
            id: '5',
            name: 'Zapier',
            description: 'Connect with 5000+ apps and automate your workflows.',
            category: 'Automation',
            status: 'pending',
            logo: 'https://via.placeholder.com/40x40/FF4A00/FFFFFF?text=ZP',
            features: ['Workflow Automation', 'Multi-app Integration', 'Triggers', 'Actions'],
            setupRequired: true
        },
        {
            id: '6',
            name: 'Salesforce',
            description: 'Sync customer data and manage your CRM pipeline.',
            category: 'CRM',
            status: 'available',
            logo: 'https://via.placeholder.com/40x40/00A1E0/FFFFFF?text=SF',
            features: ['Lead Management', 'Contact Sync', 'Deal Tracking', 'Reporting'],
            setupRequired: true
        },
        {
            id: '7',
            name: 'GitHub',
            description: 'Connect your repositories and track development activity.',
            category: 'Development',
            status: 'connected',
            logo: 'https://via.placeholder.com/40x40/181717/FFFFFF?text=GH',
            features: ['Repository Sync', 'Commit Tracking', 'Issue Management', 'Pull Requests'],
            setupRequired: false
        },
        {
            id: '8',
            name: 'AWS S3',
            description: 'Store and manage files with Amazon S3 cloud storage.',
            category: 'Storage',
            status: 'available',
            logo: 'https://via.placeholder.com/40x40/FF9900/FFFFFF?text=S3',
            features: ['File Storage', 'CDN Integration', 'Backup', 'Scalability'],
            setupRequired: true
        },
        {
            id: '9',
            name: 'HubSpot',
            description: 'Manage your marketing, sales, and customer service in one platform.',
            category: 'Marketing',
            status: 'available',
            logo: 'https://via.placeholder.com/40x40/FF7A59/FFFFFF?text=HS',
            features: ['Lead Scoring', 'Email Marketing', 'CRM', 'Analytics'],
            setupRequired: true
        },
        {
            id: '10',
            name: 'Shopify',
            description: 'Sync your e-commerce store data and manage products.',
            category: 'E-commerce',
            status: 'available',
            logo: 'https://via.placeholder.com/40x40/7AB55C/FFFFFF?text=SP',
            features: ['Product Sync', 'Order Management', 'Inventory', 'Customer Data'],
            setupRequired: true
        }
    ];

    const categories = ['all', 'Analytics', 'Payments', 'Marketing', 'Communication', 'Automation', 'CRM', 'Development', 'Storage', 'E-commerce'];

    const filteredIntegrations = integrations.filter(integration => {
        const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            integration.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
        const matchesStatus = !showConnectedOnly || integration.status === 'connected';

        return matchesSearch && matchesCategory && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'connected':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        <CheckIcon className="w-3 h-3 mr-1" />
                        Connected
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                        <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                        Pending
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        Available
                    </span>
                );
        }
    };

    const handleConnect = (integration: Integration) => {
        console.log('Connecting to:', integration.name);
        // Here you would implement the actual connection logic
    };

    const handleDisconnect = (integration: Integration) => {
        console.log('Disconnecting from:', integration.name);
        // Here you would implement the actual disconnection logic
    };

    return (
        <div className="mx-auto max-w-7xl p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Integrations</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Connect your favorite tools and services to streamline your workflow
                </p>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search integrations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category === 'all' ? 'All Categories' : category}
                            </option>
                        ))}
                    </select>

                    <label className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showConnectedOnly}
                            onChange={(e) => setShowConnectedOnly(e.target.checked)}
                            className="mr-2"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Connected only</span>
                    </label>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                            <CheckIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Connected</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {integrations.filter(i => i.status === 'connected').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <LinkIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {integrations.filter(i => i.status === 'available').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {integrations.filter(i => i.status === 'pending').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Integrations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIntegrations.map((integration) => (
                    <div key={integration.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center">
                                <img
                                    src={integration.logo}
                                    alt={integration.name}
                                    className="w-10 h-10 rounded-lg mr-3"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {integration.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {integration.category}
                                    </p>
                                </div>
                            </div>
                            {getStatusBadge(integration.status)}
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                            {integration.description}
                        </p>

                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Features:</h4>
                            <div className="flex flex-wrap gap-1">
                                {integration.features.map((feature, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                    >
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            {integration.setupRequired && integration.status !== 'connected' && (
                                <div className="flex items-center text-sm text-amber-600 dark:text-amber-400">
                                    <CogIcon className="w-4 h-4 mr-1" />
                                    Setup required
                                </div>
                            )}

                            <div className="flex gap-2">
                                {integration.status === 'connected' ? (
                                    <button
                                        onClick={() => handleDisconnect(integration)}
                                        className="flex items-center px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                        <XMarkIcon className="w-4 h-4 mr-1" />
                                        Disconnect
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleConnect(integration)}
                                        className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        <PlusIcon className="w-4 h-4 mr-1" />
                                        Connect
                                    </button>
                                )}

                                {integration.status === 'connected' && (
                                    <button className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                                        <CogIcon className="w-4 h-4 mr-1" />
                                        Configure
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredIntegrations.length === 0 && (
                <div className="text-center py-12">
                    <ShieldCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No integrations found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Try adjusting your search or filter criteria.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Integrations;
