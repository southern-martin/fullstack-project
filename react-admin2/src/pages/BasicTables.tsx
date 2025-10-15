import {
    ChevronDownIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    UserIcon,
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';

interface TableData {
    id: number;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive' | 'pending';
    lastLogin: string;
    avatar?: string;
}

const BasicTables: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<keyof TableData>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const mockData: TableData[] = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
            role: 'Admin',
            status: 'active',
            lastLogin: '2024-01-15 10:30:00',
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            role: 'User',
            status: 'active',
            lastLogin: '2024-01-14 15:45:00',
        },
        {
            id: 3,
            name: 'Mike Johnson',
            email: 'mike.johnson@example.com',
            role: 'Editor',
            status: 'inactive',
            lastLogin: '2024-01-10 09:20:00',
        },
        {
            id: 4,
            name: 'Sarah Wilson',
            email: 'sarah.wilson@example.com',
            role: 'User',
            status: 'pending',
            lastLogin: '2024-01-12 14:15:00',
        },
        {
            id: 5,
            name: 'David Brown',
            email: 'david.brown@example.com',
            role: 'Admin',
            status: 'active',
            lastLogin: '2024-01-15 08:45:00',
        },
        {
            id: 6,
            name: 'Lisa Davis',
            email: 'lisa.davis@example.com',
            role: 'User',
            status: 'active',
            lastLogin: '2024-01-13 16:30:00',
        },
        {
            id: 7,
            name: 'Tom Anderson',
            email: 'tom.anderson@example.com',
            role: 'Editor',
            status: 'inactive',
            lastLogin: '2024-01-08 11:20:00',
        },
        {
            id: 8,
            name: 'Emma Taylor',
            email: 'emma.taylor@example.com',
            role: 'User',
            status: 'pending',
            lastLogin: '2024-01-11 13:45:00',
        },
    ];

    const filteredData = mockData.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedData = [...filteredData].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        // Handle undefined values
        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return sortDirection === 'asc' ? -1 : 1;
        if (bValue === undefined) return sortDirection === 'asc' ? 1 : -1;

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = sortedData.slice(startIndex, endIndex);

    const handleSort = (field: keyof TableData) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getStatusBadge = (status: string) => {
        const statusClasses = {
            active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
            inactive: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
        };

        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClasses[status as keyof typeof statusClasses]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const getRoleBadge = (role: string) => {
        const roleClasses = {
            Admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
            Editor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
            User: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
        };

        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${roleClasses[role as keyof typeof roleClasses] || roleClasses.User}`}>
                {role}
            </span>
        );
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Basic Tables</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage and view your data in organized tables</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 items-center space-x-2">
                    <div className="relative flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 pl-10 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Showing {startIndex + 1}-{Math.min(endIndex, sortedData.length)} of {sortedData.length} results
                    </span>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th
                                    scope="col"
                                    className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                                    onClick={() => handleSort('name')}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>User</span>
                                        <ChevronDownIcon className={`h-4 w-4 transition-transform ${sortField === 'name' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                                    onClick={() => handleSort('role')}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Role</span>
                                        <ChevronDownIcon className={`h-4 w-4 transition-transform ${sortField === 'role' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                                    onClick={() => handleSort('status')}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Status</span>
                                        <ChevronDownIcon className={`h-4 w-4 transition-transform ${sortField === 'status' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                                    onClick={() => handleSort('lastLogin')}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Last Login</span>
                                        <ChevronDownIcon className={`h-4 w-4 transition-transform ${sortField === 'lastLogin' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                                    </div>
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                            {currentData.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                                                    <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {user.name}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {getRoleBadge(user.role)}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {getStatusBadge(user.status)}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {user.lastLogin}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                                                <EyeIcon className="h-4 w-4" />
                                            </button>
                                            <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                                <PencilIcon className="h-4 w-4" />
                                            </button>
                                            <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
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

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Rows per page:</span>
                    <select
                        value={itemsPerPage}
                        className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        disabled
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        Previous
                    </button>

                    <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = i + 1;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`px-3 py-1 text-sm rounded-lg ${currentPage === pageNum
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BasicTables;
