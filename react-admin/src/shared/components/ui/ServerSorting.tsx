import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useSharedUILabels } from '../../hooks/useSharedUILabels';

export interface SortOption {
    key: string;
    label: string;
    defaultOrder?: 'asc' | 'desc';
}

export interface ServerSortingProps {
    // Sorting state
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;

    // Configuration
    sortOptions: SortOption[];
    placeholder?: string;

    // Loading state
    loading?: boolean;

    // Styling
    className?: string;
    selectClassName?: string;
}

export const ServerSorting: React.FC<ServerSortingProps> = ({
    sortBy,
    sortOrder,
    onSortChange,
    sortOptions,
    placeholder,
    loading = false,
    className = '',
    selectClassName = '',
}) => {
    // Get translated labels
    const { labels: L } = useSharedUILabels();

    // Use translated placeholder if not provided
    const displayPlaceholder = placeholder || L.sorting.sortByPlaceholder;

    const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSortBy = e.target.value;
        if (newSortBy && newSortBy !== sortBy) {
            // Find the default order for this sort option
            const option = sortOptions.find(opt => opt.key === newSortBy);
            const defaultOrder = option?.defaultOrder || 'asc';
            onSortChange(newSortBy, defaultOrder);
        }
    };

    const handleSortOrderToggle = () => {
        if (sortBy) {
            const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
            onSortChange(sortBy, newOrder);
        }
    };

    const getSortIcon = () => {
        if (!sortBy) return null;

        return sortOrder === 'asc' ? (
            <ChevronUpIcon className="h-4 w-4" />
        ) : (
            <ChevronDownIcon className="h-4 w-4" />
        );
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <label htmlFor="sort-by" className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                {L.sorting.sortBy}
            </label>

            <div className="flex items-center gap-1">
                <select
                    id="sort-by"
                    value={sortBy}
                    onChange={handleSortByChange}
                    disabled={loading}
                    className={`rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed ${selectClassName}`}
                >
                    <option value="">{displayPlaceholder}</option>
                    {sortOptions.map((option) => (
                        <option key={option.key} value={option.key}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {sortBy && (
                    <button
                        type="button"
                        onClick={handleSortOrderToggle}
                        disabled={loading}
                        className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:text-gray-600 dark:focus:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={sortOrder === 'asc' ? L.sorting.sortDescending : L.sorting.sortAscending}
                    >
                        {getSortIcon()}
                    </button>
                )}
            </div>
        </div>
    );
};
