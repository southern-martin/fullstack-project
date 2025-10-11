import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useTableContext } from './TableProvider';

export const TablePagination = () => {
    const { config, state, actions } = useTableContext();

    const { pagination } = state;
    const { page, pageSize, total, totalPages, hasNextPage, hasPreviousPage, startIndex, endIndex } = pagination as any;

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            actions.handlePageChange(newPage);
        }
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPageSize = parseInt(e.target.value);
        actions.handlePageSizeChange(newPageSize);
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const start = Math.max(1, page - Math.floor(maxVisiblePages / 2));
            const end = Math.min(totalPages, start + maxVisiblePages - 1);

            if (start > 1) {
                pages.push(1);
                if (start > 2) {
                    pages.push('...');
                }
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (end < totalPages) {
                if (end < totalPages - 1) {
                    pages.push('...');
                }
                pages.push(totalPages);
            }
        }

        return pages;
    };

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex justify-between items-center">
            {/* Page info */}
            <div className="text-sm text-gray-700">
                {config.pagination?.showTotal && (
                    <span>
                        Showing {startIndex} to {endIndex} of {total} results
                    </span>
                )}
            </div>

            {/* Pagination controls */}
            <div className="flex items-center space-x-2">
                {/* Page size selector */}
                {config.pagination?.showPageSize && config.pagination?.pageSizeOptions && (
                    <div className="flex items-center space-x-2">
                        <label htmlFor="page-size" className="text-sm text-gray-700">
                            Show:
                        </label>
                        <select
                            id="page-size"
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                            {config.pagination.pageSizeOptions.map(size => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Previous button */}
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={!hasPreviousPage}
                    className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeftIcon className="h-4 w-4" />
                </button>

                {/* Page numbers */}
                <div className="flex space-x-1">
                    {getPageNumbers().map((pageNum, index) => (
                        <button
                            key={index}
                            onClick={() => typeof pageNum === 'number' && handlePageChange(pageNum)}
                            disabled={pageNum === '...'}
                            className={`
                px-3 py-2 text-sm rounded-md border
                ${pageNum === page
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : pageNum === '...'
                                        ? 'border-transparent text-gray-500 cursor-default'
                                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                }
              `}
                        >
                            {pageNum}
                        </button>
                    ))}
                </div>

                {/* Next button */}
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={!hasNextPage}
                    className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronRightIcon className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};
