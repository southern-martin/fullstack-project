import {
    ChevronDownIcon,
    EyeIcon,
    FunnelIcon,
    PencilIcon,
    TrashIcon,
    UserIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import React, { useMemo, useState } from 'react';

interface DataTableItem {
    id: number;
    name: string;
    email: string;
    department: string;
    position: string;
    salary: number;
    status: 'active' | 'inactive' | 'pending';
    joinDate: string;
    lastLogin: string;
    avatar?: string;
}

const DataTables: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<keyof DataTableItem>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [filters, setFilters] = useState({
        department: '',
        status: '',
        position: '',
    });
    const [showFilters, setShowFilters] = useState(false);

    const mockData: DataTableItem[] = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
            department: 'Engineering',
            position: 'Senior Developer',
            salary: 95000,
            status: 'active',
            joinDate: '2022-01-15',
            lastLogin: '2024-01-15 10:30:00',
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            department: 'Marketing',
            position: 'Marketing Manager',
            salary: 75000,
            status: 'active',
            joinDate: '2022-03-20',
            lastLogin: '2024-01-14 15:45:00',
        },
        {
            id: 3,
            name: 'Mike Johnson',
            email: 'mike.johnson@example.com',
            department: 'Engineering',
            position: 'Frontend Developer',
            salary: 80000,
            status: 'inactive',
            joinDate: '2021-11-10',
            lastLogin: '2024-01-10 09:20:00',
        },
        {
            id: 4,
            name: 'Sarah Wilson',
            email: 'sarah.wilson@example.com',
            department: 'HR',
            position: 'HR Specialist',
            salary: 65000,
            status: 'pending',
            joinDate: '2024-01-01',
            lastLogin: '2024-01-12 14:15:00',
        },
        {
            id: 5,
            name: 'David Brown',
            email: 'david.brown@example.com',
            department: 'Engineering',
            position: 'Tech Lead',
            salary: 120000,
            status: 'active',
            joinDate: '2020-06-15',
            lastLogin: '2024-01-15 08:45:00',
        },
        {
            id: 6,
            name: 'Lisa Davis',
            email: 'lisa.davis@example.com',
            department: 'Sales',
            position: 'Sales Representative',
            salary: 60000,
            status: 'active',
            joinDate: '2022-08-22',
            lastLogin: '2024-01-13 16:30:00',
        },
        {
            id: 7,
            name: 'Tom Anderson',
            email: 'tom.anderson@example.com',
            department: 'Marketing',
            position: 'Content Writer',
            salary: 55000,
            status: 'inactive',
            joinDate: '2021-09-05',
            lastLogin: '2024-01-08 11:20:00',
        },
        {
            id: 8,
            name: 'Emma Taylor',
            email: 'emma.taylor@example.com',
            department: 'Finance',
            position: 'Financial Analyst',
            salary: 70000,
            status: 'pending',
            joinDate: '2023-12-01',
            lastLogin: '2024-01-11 13:45:00',
        },
        {
            id: 9,
            name: 'Alex Rodriguez',
            email: 'alex.rodriguez@example.com',
            department: 'Engineering',
            position: 'Backend Developer',
            salary: 85000,
            status: 'active',
            joinDate: '2022-05-10',
            lastLogin: '2024-01-15 12:00:00',
        },
        {
            id: 10,
            name: 'Maria Garcia',
            email: 'maria.garcia@example.com',
            department: 'Design',
            position: 'UI/UX Designer',
            salary: 72000,
            status: 'active',
            joinDate: '2022-07-18',
            lastLogin: '2024-01-14 09:30:00',
        },
    ];

    const departments = Array.from(new Set(mockData.map(item => item.department)));
    const positions = Array.from(new Set(mockData.map(item => item.position)));

    const filteredAndSortedData = useMemo(() => {
        let filtered = mockData.filter(item => {
            const matchesSearch =
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.position.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFilters =
                (!filters.department || item.department === filters.department) &&
                (!filters.status || item.status === filters.status) &&
                (!filters.position || item.position === filters.position);

            return matchesSearch && matchesFilters;
        });

        return filtered.sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];

            // Handle undefined values
            if (aValue === undefined && bValue === undefined) return 0;
            if (aValue === undefined) return sortDirection === 'asc' ? -1 : 1;
            if (bValue === undefined) return sortDirection === 'asc' ? 1 : -1;

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [mockData, searchTerm, filters, sortField, sortDirection]);

    const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredAndSortedData.slice(startIndex, endIndex);

    const handleSort = (field: keyof DataTableItem) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({ department: '', status: '', position: '' });
        setSearchTerm('');
        setCurrentPage(1);
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

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Data Tables</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Advanced data tables with filtering, sorting, and pagination</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-1 items-center space-x-2">
                        <div className="relative flex-1 max-w-md">
                            <input
                                type="text"
                                placeholder="Search employees..."
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

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${showFilters || Object.values(filters).some(f => f !== '')
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                }`}
                        >
                            <FunnelIcon className="h-4 w-4" />
                            <span>Filters</span>
                        </button>
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedData.length)} of {filteredAndSortedData.length} results
                        </span>
                    </div>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Advanced Filters</h3>
                            <button
                                onClick={clearFilters}
                                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <XMarkIcon className="h-4 w-4" />
                                <span>Clear All</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Department</label>
                                <select
                                    value={filters.department}
                                    onChange={(e) => handleFilterChange('department', e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="">All Departments</option>
                                    {departments.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Status</label>
                                <select
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Position</label>
                                <select
                                    value={filters.position}
                                    onChange={(e) => handleFilterChange('position', e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="">All Positions</option>
                                    {positions.map(position => (
                                        <option key={position} value={position}>{position}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}
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
                                        <span>Employee</span>
                                        <ChevronDownIcon className={`h-4 w-4 transition-transform ${sortField === 'name' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                                    onClick={() => handleSort('department')}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Department</span>
                                        <ChevronDownIcon className={`h-4 w-4 transition-transform ${sortField === 'department' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                                    onClick={() => handleSort('position')}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Position</span>
                                        <ChevronDownIcon className={`h-4 w-4 transition-transform ${sortField === 'position' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                                    onClick={() => handleSort('salary')}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Salary</span>
                                        <ChevronDownIcon className={`h-4 w-4 transition-transform ${sortField === 'salary' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
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
                                    onClick={() => handleSort('joinDate')}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Join Date</span>
                                        <ChevronDownIcon className={`h-4 w-4 transition-transform ${sortField === 'joinDate' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                                    </div>
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                            {currentData.map((employee) => (
                                <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                                                    <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {employee.name}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {employee.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                                        {employee.department}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                                        {employee.position}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                                        {formatCurrency(employee.salary)}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {getStatusBadge(employee.status)}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {formatDate(employee.joinDate)}
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
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                        <option value={5}>5</option>
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

export default DataTables;
