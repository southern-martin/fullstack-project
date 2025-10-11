import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useTableContext } from './TableProvider';

export const TableSearch = () => {
    const { config, state, actions } = useTableContext();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        actions.handleSearch(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Search is handled in real-time, no need for form submission
    };

    return (
        <form onSubmit={handleSearchSubmit} className="flex gap-4">
            <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder={config.filtering?.searchPlaceholder || 'Search...'}
                    value={state.filtering.searchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {state.filtering.searchTerm && (
                <button
                    type="button"
                    onClick={() => actions.handleSearch('')}
                    className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
                >
                    Clear
                </button>
            )}
        </form>
    );
};

