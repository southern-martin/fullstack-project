import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import React from 'react';

export interface ServerPaginationProps {
    // Pagination state
    currentPage: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startIndex: number;
    endIndex: number;

    // Loading state
    loading?: boolean;

    // Page size options
    pageSizeOptions?: number[];

    // Actions
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;

    // Display options
    showPageSizeSelector?: boolean;
    showTotalInfo?: boolean;
    showPageNumbers?: boolean;
    maxVisiblePages?: number;

    // Styling
    className?: string;
}

export const ServerPagination: React.FC<ServerPaginationProps> = ({
    currentPage,
    pageSize,
    total,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    startIndex,
    endIndex,
    loading = false,
    pageSizeOptions = [5, 10, 25, 50, 100],
    onPageChange,
    onPageSizeChange,
    showPageSizeSelector = true,
    showTotalInfo = true,
    showPageNumbers = true,
    maxVisiblePages = 5,
    className = '',
}) => {
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages && page !== currentPage && !loading) {
            onPageChange(page);
        }
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPageSize = parseInt(e.target.value);
        if (newPageSize !== pageSize && !loading) {
            onPageSizeChange(newPageSize);
        }
    };

    const getPageNumbers = () => {
        if (!showPageNumbers || totalPages <= 1) {
            return [];
        }

        const pages: (number | string)[] = [];

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is less than max visible
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Calculate start and end of visible range
            const halfVisible = Math.floor(maxVisiblePages / 2);
            let start = Math.max(1, currentPage - halfVisible);
            const end = Math.min(totalPages, start + maxVisiblePages - 1);

            // Adjust start if we're near the end
            if (end - start + 1 < maxVisiblePages) {
                start = Math.max(1, end - maxVisiblePages + 1);
            }

            // Add first page and ellipsis if needed
            if (start > 1) {
                pages.push(1);
                if (start > 2) {
                    pages.push('...');
                }
            }

            // Add visible pages
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            // Add ellipsis and last page if needed
            if (end < totalPages) {
                if (end < totalPages - 1) {
                    pages.push('...');
                }
                pages.push(totalPages);
            }
        }

        return pages;
    };

    // Don't render if there's only one page or no data
    if (totalPages <= 1 && total === 0) {
        return null;
    }

    const pageNumbers = getPageNumbers();

    return (
        <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 ${className}`}>
            {/* Total info and page size selector */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
                {showTotalInfo && (
                    <div className="text-sm text-gray-700">
                        {loading ? (
                            <span className="animate-pulse">Loading...</span>
                        ) : (
                            <>
                                Showing <span className="font-medium">{startIndex}</span> to{' '}
                                <span className="font-medium">{endIndex}</span> of{' '}
                                <span className="font-medium">{total.toLocaleString()}</span> results
                            </>
                        )}
                    </div>
                )}

                {showPageSizeSelector && (
                    <div className="flex items-center gap-2">
                        <label htmlFor="page-size" className="text-sm text-gray-700">
                            Show:
                        </label>
                        <select
                            id="page-size"
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            disabled={loading}
                            className="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {pageSizeOptions.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                        <span className="text-sm text-gray-700">per page</span>
                    </div>
                )}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
                <div className="flex items-center gap-1">
                    {/* Previous button */}
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!hasPreviousPage || loading}
                        className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Previous page"
                    >
                        <ChevronLeftIcon className="h-4 w-4" />
                    </button>

                    {/* Page numbers */}
                    {showPageNumbers && pageNumbers.map((page, index) => (
                        <React.Fragment key={index}>
                            {page === '...' ? (
                                <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
                                    ...
                                </span>
                            ) : (
                                <button
                                    onClick={() => handlePageChange(page as number)}
                                    disabled={loading}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border ${page === currentPage
                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                        } focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                                    aria-label={`Go to page ${page}`}
                                    aria-current={page === currentPage ? 'page' : undefined}
                                >
                                    {page}
                                </button>
                            )}
                        </React.Fragment>
                    ))}

                    {/* Next button */}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!hasNextPage || loading}
                        className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Next page"
                    >
                        <ChevronRightIcon className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    );
};
