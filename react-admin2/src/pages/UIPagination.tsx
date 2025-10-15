import {
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';

const UIPagination: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPage2, setCurrentPage2] = useState(1);
    const [currentPage3, setCurrentPage3] = useState(1);
    const [currentPage4, setCurrentPage4] = useState(1);
    const [currentPage5, setCurrentPage5] = useState(1);
    const [currentPage6, setCurrentPage6] = useState(1);

    const totalPages = 10;
    const totalItems = 250;
    const itemsPerPage = 25;

    const generatePageNumbers = (current: number, total: number, maxVisible: number = 5) => {
        const pages: (number | string)[] = [];
        const half = Math.floor(maxVisible / 2);

        if (total <= maxVisible) {
            for (let i = 1; i <= total; i++) {
                pages.push(i);
            }
        } else {
            if (current <= half) {
                for (let i = 1; i <= maxVisible - 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(total);
            } else if (current >= total - half) {
                pages.push(1);
                pages.push('...');
                for (let i = total - maxVisible + 2; i <= total; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = current - 1; i <= current + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(total);
            }
        }

        return pages;
    };

    const handlePageChange = (page: number, setter: React.Dispatch<React.SetStateAction<number>>) => {
        if (page >= 1 && page <= totalPages) {
            setter(page);
        }
    };

    const PaginationButton = ({
        page,
        isActive,
        onClick,
        children
    }: {
        page: number | string;
        isActive?: boolean;
        onClick: () => void;
        children?: React.ReactNode;
    }) => (
        <button
            onClick={onClick}
            disabled={page === '...'}
            className={`px-3 py-2 text-sm font-medium border rounded-md transition-colors ${isActive
                    ? 'bg-blue-600 text-white border-blue-600'
                    : page === '...'
                        ? 'text-gray-400 cursor-default'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                }`}
        >
            {children || page}
        </button>
    );

    return (
        <div className="mx-auto max-w-7xl p-6">
            <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">Pagination</h1>

            {/* Basic Pagination */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Basic Pagination</h2>
                <div className="flex items-center justify-center space-x-1">
                    <PaginationButton
                        page={currentPage - 1}
                        onClick={() => handlePageChange(currentPage - 1, setCurrentPage)}
                    >
                        <ChevronLeftIcon className="h-4 w-4" />
                    </PaginationButton>

                    {generatePageNumbers(currentPage, totalPages).map((page, index) => (
                        <PaginationButton
                            key={index}
                            page={page}
                            isActive={page === currentPage}
                            onClick={() => typeof page === 'number' && handlePageChange(page, setCurrentPage)}
                        />
                    ))}

                    <PaginationButton
                        page={currentPage + 1}
                        onClick={() => handlePageChange(currentPage + 1, setCurrentPage)}
                    >
                        <ChevronRightIcon className="h-4 w-4" />
                    </PaginationButton>
                </div>
            </div>

            {/* Pagination with First/Last */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">With First/Last Buttons</h2>
                <div className="flex items-center justify-center space-x-1">
                    <PaginationButton
                        page={1}
                        onClick={() => handlePageChange(1, setCurrentPage2)}
                    >
                        <ChevronDoubleLeftIcon className="h-4 w-4" />
                    </PaginationButton>

                    <PaginationButton
                        page={currentPage2 - 1}
                        onClick={() => handlePageChange(currentPage2 - 1, setCurrentPage2)}
                    >
                        <ChevronLeftIcon className="h-4 w-4" />
                    </PaginationButton>

                    {generatePageNumbers(currentPage2, totalPages).map((page, index) => (
                        <PaginationButton
                            key={index}
                            page={page}
                            isActive={page === currentPage2}
                            onClick={() => typeof page === 'number' && handlePageChange(page, setCurrentPage2)}
                        />
                    ))}

                    <PaginationButton
                        page={currentPage2 + 1}
                        onClick={() => handlePageChange(currentPage2 + 1, setCurrentPage2)}
                    >
                        <ChevronRightIcon className="h-4 w-4" />
                    </PaginationButton>

                    <PaginationButton
                        page={totalPages}
                        onClick={() => handlePageChange(totalPages, setCurrentPage2)}
                    >
                        <ChevronDoubleRightIcon className="h-4 w-4" />
                    </PaginationButton>
                </div>
            </div>

            {/* Compact Pagination */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Compact Pagination</h2>
                <div className="flex items-center justify-center space-x-1">
                    <PaginationButton
                        page={currentPage3 - 1}
                        onClick={() => handlePageChange(currentPage3 - 1, setCurrentPage3)}
                    >
                        <ChevronLeftIcon className="h-4 w-4" />
                    </PaginationButton>

                    <span className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                        Page {currentPage3} of {totalPages}
                    </span>

                    <PaginationButton
                        page={currentPage3 + 1}
                        onClick={() => handlePageChange(currentPage3 + 1, setCurrentPage3)}
                    >
                        <ChevronRightIcon className="h-4 w-4" />
                    </PaginationButton>
                </div>
            </div>

            {/* Pagination with Info */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">With Item Information</h2>
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                        Showing {((currentPage4 - 1) * itemsPerPage) + 1} to {Math.min(currentPage4 * itemsPerPage, totalItems)} of {totalItems} results
                    </div>
                    <div className="flex items-center space-x-1">
                        <PaginationButton
                            page={currentPage4 - 1}
                            onClick={() => handlePageChange(currentPage4 - 1, setCurrentPage4)}
                        >
                            <ChevronLeftIcon className="h-4 w-4" />
                        </PaginationButton>

                        {generatePageNumbers(currentPage4, totalPages, 3).map((page, index) => (
                            <PaginationButton
                                key={index}
                                page={page}
                                isActive={page === currentPage4}
                                onClick={() => typeof page === 'number' && handlePageChange(page, setCurrentPage4)}
                            />
                        ))}

                        <PaginationButton
                            page={currentPage4 + 1}
                            onClick={() => handlePageChange(currentPage4 + 1, setCurrentPage4)}
                        >
                            <ChevronRightIcon className="h-4 w-4" />
                        </PaginationButton>
                    </div>
                </div>
            </div>

            {/* Large Pagination */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Large Size</h2>
                <div className="flex items-center justify-center space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage5 - 1, setCurrentPage5)}
                        disabled={currentPage5 === 1}
                        className="px-4 py-2 text-base font-medium border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                        <ChevronLeftIcon className="h-5 w-5" />
                    </button>

                    {generatePageNumbers(currentPage5, totalPages, 3).map((page, index) => (
                        <button
                            key={index}
                            onClick={() => typeof page === 'number' && handlePageChange(page, setCurrentPage5)}
                            disabled={page === '...'}
                            className={`px-4 py-2 text-base font-medium border rounded-md transition-colors ${page === currentPage5
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : page === '...'
                                        ? 'text-gray-400 cursor-default'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                                }`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(currentPage5 + 1, setCurrentPage5)}
                        disabled={currentPage5 === totalPages}
                        className="px-4 py-2 text-base font-medium border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                        <ChevronRightIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Small Pagination */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Small Size</h2>
                <div className="flex items-center justify-center space-x-1">
                    <button
                        onClick={() => handlePageChange(currentPage6 - 1, setCurrentPage6)}
                        disabled={currentPage6 === 1}
                        className="px-2 py-1 text-xs font-medium border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                        <ChevronLeftIcon className="h-3 w-3" />
                    </button>

                    {generatePageNumbers(currentPage6, totalPages, 3).map((page, index) => (
                        <button
                            key={index}
                            onClick={() => typeof page === 'number' && handlePageChange(page, setCurrentPage6)}
                            disabled={page === '...'}
                            className={`px-2 py-1 text-xs font-medium border rounded transition-colors ${page === currentPage6
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : page === '...'
                                        ? 'text-gray-400 cursor-default'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                                }`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(currentPage6 + 1, setCurrentPage6)}
                        disabled={currentPage6 === totalPages}
                        className="px-2 py-1 text-xs font-medium border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                        <ChevronRightIcon className="h-3 w-3" />
                    </button>
                </div>
            </div>

            {/* Pagination with Page Size Selector */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">With Page Size Selector</h2>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-700 dark:text-gray-300">Show:</span>
                        <select className="rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        <span className="text-sm text-gray-700 dark:text-gray-300">per page</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <PaginationButton
                            page={1}
                            onClick={() => handlePageChange(1, setCurrentPage)}
                        >
                            <ChevronDoubleLeftIcon className="h-4 w-4" />
                        </PaginationButton>

                        <PaginationButton
                            page={currentPage - 1}
                            onClick={() => handlePageChange(currentPage - 1, setCurrentPage)}
                        >
                            <ChevronLeftIcon className="h-4 w-4" />
                        </PaginationButton>

                        {generatePageNumbers(currentPage, totalPages, 3).map((page, index) => (
                            <PaginationButton
                                key={index}
                                page={page}
                                isActive={page === currentPage}
                                onClick={() => typeof page === 'number' && handlePageChange(page, setCurrentPage)}
                            />
                        ))}

                        <PaginationButton
                            page={currentPage + 1}
                            onClick={() => handlePageChange(currentPage + 1, setCurrentPage)}
                        >
                            <ChevronRightIcon className="h-4 w-4" />
                        </PaginationButton>

                        <PaginationButton
                            page={totalPages}
                            onClick={() => handlePageChange(totalPages, setCurrentPage)}
                        >
                            <ChevronDoubleRightIcon className="h-4 w-4" />
                        </PaginationButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UIPagination;
