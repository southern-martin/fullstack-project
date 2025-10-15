import {
    CalendarIcon,
    CheckCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    EyeIcon,
    EyeSlashIcon,
    KeyIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';

interface ApiKey {
    id: string;
    name: string;
    key: string;
    description: string;
    permissions: string[];
    status: 'active' | 'inactive' | 'expired';
    createdAt: string;
    lastUsed: string;
    expiresAt?: string;
    usage: {
        requests: number;
        limit: number;
    };
}

const mockApiKeys: ApiKey[] = [
    {
        id: '1',
        name: 'Production API',
        key: 'sk-prod-1234567890abcdef',
        description: 'Main production API key for live applications',
        permissions: ['read', 'write', 'admin'],
        status: 'active',
        createdAt: '2024-01-15',
        lastUsed: '2024-01-20',
        expiresAt: '2024-12-31',
        usage: {
            requests: 125000,
            limit: 1000000
        }
    },
    {
        id: '2',
        name: 'Development API',
        key: 'sk-dev-abcdef1234567890',
        description: 'Development and testing API key',
        permissions: ['read', 'write'],
        status: 'active',
        createdAt: '2024-01-10',
        lastUsed: '2024-01-19',
        usage: {
            requests: 45000,
            limit: 100000
        }
    },
    {
        id: '3',
        name: 'Read-Only API',
        key: 'sk-read-9876543210fedcba',
        description: 'Read-only access for analytics and reporting',
        permissions: ['read'],
        status: 'active',
        createdAt: '2024-01-05',
        lastUsed: '2024-01-18',
        expiresAt: '2024-06-30',
        usage: {
            requests: 25000,
            limit: 50000
        }
    },
    {
        id: '4',
        name: 'Legacy API',
        key: 'sk-legacy-5555555555555555',
        description: 'Legacy API key for old integrations',
        permissions: ['read'],
        status: 'expired',
        createdAt: '2023-12-01',
        lastUsed: '2024-01-01',
        expiresAt: '2024-01-01',
        usage: {
            requests: 100000,
            limit: 100000
        }
    }
];

const ApiKeys: React.FC = () => {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showKeyModal, setShowKeyModal] = useState(false);
    const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);
    const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const toggleKeyVisibility = (keyId: string) => {
        setVisibleKeys(prev => {
            const newSet = new Set(prev);
            if (newSet.has(keyId)) {
                newSet.delete(keyId);
            } else {
                newSet.add(keyId);
            }
            return newSet;
        });
    };

    const maskKey = (key: string) => {
        return key.substring(0, 8) + '•'.repeat(key.length - 12) + key.substring(key.length - 4);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
            case 'inactive':
                return <XCircleIcon className="h-4 w-4 text-gray-500" />;
            case 'expired':
                return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            case 'inactive':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
            case 'expired':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    const filteredKeys = apiKeys.filter(key => {
        const matchesSearch = key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            key.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || key.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleDeleteKey = (keyId: string) => {
        if (window.confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
            setApiKeys(prev => prev.filter(key => key.id !== keyId));
        }
    };

    const handleToggleStatus = (keyId: string) => {
        setApiKeys(prev => prev.map(key =>
            key.id === keyId
                ? { ...key, status: key.status === 'active' ? 'inactive' : 'active' as 'active' | 'inactive' }
                : key
        ));
    };

    return (
        <div className="mx-auto max-w-7xl p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">API Keys</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Manage your API keys and access tokens
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Create API Key
                </button>
            </div>

            {/* Stats Cards */}
            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <KeyIcon className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Keys</p>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{apiKeys.length}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <CheckCircleIcon className="h-8 w-8 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Keys</p>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                {apiKeys.filter(key => key.status === 'active').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Expired Keys</p>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                {apiKeys.filter(key => key.status === 'expired').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <ClockIcon className="h-8 w-8 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Requests</p>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                {apiKeys.reduce((sum, key) => sum + key.usage.requests, 0).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search API keys..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                        />
                    </div>
                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="expired">Expired</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* API Keys Table */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    API Key
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Permissions
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Usage
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Last Used
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                            {filteredKeys.map((key) => (
                                <tr key={key.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {key.name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {key.description}
                                            </div>
                                            <div className="mt-1 flex items-center space-x-2">
                                                <code className="rounded bg-gray-100 px-2 py-1 text-xs font-mono text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                                                    {visibleKeys.has(key.id) ? key.key : maskKey(key.key)}
                                                </code>
                                                <button
                                                    onClick={() => toggleKeyVisibility(key.id)}
                                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                >
                                                    {visibleKeys.has(key.id) ? (
                                                        <EyeSlashIcon className="h-4 w-4" />
                                                    ) : (
                                                        <EyeIcon className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {key.permissions.map((permission) => (
                                                <span
                                                    key={permission}
                                                    className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                                                >
                                                    {permission}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            {getStatusIcon(key.status)}
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(key.status)}`}>
                                                {key.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 dark:text-white">
                                            {key.usage.requests.toLocaleString()} / {key.usage.limit.toLocaleString()}
                                        </div>
                                        <div className="mt-1 w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{ width: `${Math.min((key.usage.requests / key.usage.limit) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center space-x-1">
                                            <CalendarIcon className="h-4 w-4" />
                                            <span>{key.lastUsed}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleToggleStatus(key.id)}
                                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                title={key.status === 'active' ? 'Deactivate' : 'Activate'}
                                            >
                                                {key.status === 'active' ? (
                                                    <XCircleIcon className="h-4 w-4" />
                                                ) : (
                                                    <CheckCircleIcon className="h-4 w-4" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedKey(key);
                                                    setShowKeyModal(true);
                                                }}
                                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                title="Edit"
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteKey(key.id)}
                                                className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                                                title="Delete"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create API Key Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowCreateModal(false)}></div>
                        <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Create New API Key</h3>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        placeholder="Enter API key name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Description
                                    </label>
                                    <textarea
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        rows={3}
                                        placeholder="Enter description"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Permissions
                                    </label>
                                    <div className="mt-2 space-y-2">
                                        {['read', 'write', 'admin'].map((permission) => (
                                            <label key={permission} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                                                    {permission}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                    >
                                        Create Key
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApiKeys;
