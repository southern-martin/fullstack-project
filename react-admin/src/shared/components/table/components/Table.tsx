import { useEffect } from 'react';
import { TableProps } from '../types';
import { TableActions } from './TableActions';
import { TableBody } from './TableBody';
import { TableHeader } from './TableHeader';
import { TablePagination } from './TablePagination';
import { TableProvider, useTableContext } from './TableProvider';
import { TableSearch } from './TableSearch';

// Internal Table component that uses context
const TableInternal = <T = any>({
    className = '',
    onDataChange,
    onPaginationChange,
    onSortingChange,
    onFilteringChange,
    onSelectionChange,
    externalData,
    externalLoading,
    externalError,
}: Omit<TableProps<T>, 'config' | 'data' | 'loading' | 'error'> & {
    externalData?: T[];
    externalLoading?: boolean;
    externalError?: string;
}) => {
    const { config, state, actions } = useTableContext<T>();

    // Type assertion to help TypeScript understand the state structure
    const dataState = state.data as any;

    // Use external props if available, otherwise use internal state
    const currentData = externalData !== undefined ? externalData : dataState.data;
    const currentLoading = externalLoading !== undefined ? externalLoading : dataState.loading;
    const currentError = externalError !== undefined ? externalError : dataState.error;

    // Sync external data with internal state
    useEffect(() => {
        if (onDataChange) {
            onDataChange(dataState.data);
        }
    }, [dataState.data, onDataChange]);

    useEffect(() => {
        if (onPaginationChange) {
            onPaginationChange(state.pagination);
        }
    }, [state.pagination, onPaginationChange]);

    useEffect(() => {
        if (onSortingChange) {
            onSortingChange(state.sorting);
        }
    }, [state.sorting, onSortingChange]);

    useEffect(() => {
        if (onFilteringChange) {
            onFilteringChange(state.filtering);
        }
    }, [state.filtering, onFilteringChange]);

    useEffect(() => {
        if (onSelectionChange) {
            onSelectionChange(state.selection);
        }
    }, [state.selection, onSelectionChange]);

    // Sync external props with internal state
    useEffect(() => {
        if (externalData !== undefined) {
            actions.setData(externalData);
        }
    }, [externalData, actions]);

    useEffect(() => {
        if (externalLoading !== undefined) {
            actions.setLoading(externalLoading);
        }
    }, [externalLoading, actions]);

    useEffect(() => {
        if (externalError !== undefined) {
            actions.setError(externalError);
        }
    }, [externalError, actions]);

    // Handle loading state
    if (currentLoading) {
        return (
            <div className={`table-container ${className}`}>
                <div className="table-loading">
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
                        <span className="ml-2 text-gray-500 dark:text-gray-400">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    // Handle error state
    if (currentError) {
        return (
            <div className={`table-container ${className}`}>
                <div className="table-error">
                    <div className="flex justify-center items-center py-12">
                        <div className="text-red-500 dark:text-red-400 text-center">
                            <div className="text-lg font-medium mb-2">Error</div>
                            <div className="text-sm">{currentError}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Handle empty state
    if (currentData.length === 0) {
        return (
            <div className={`table-container ${className}`}>
                <div className="table-empty">
                    <div className="flex justify-center items-center py-12">
                        <div className="text-gray-500 dark:text-gray-400 text-center">
                            <div className="text-lg font-medium mb-2">
                                {config.emptyMessage || 'No data available'}
                            </div>
                            <div className="text-sm">Try adjusting your search or filters</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`table-container ${className}`}>
            {/* Table Search */}
            {config.filtering?.globalSearch && (
                <div className="table-search mb-4">
                    <TableSearch />
                </div>
            )}

            {/* Table Actions */}
            {config.actions && config.actions.length > 0 && (
                <div className="table-actions mb-4">
                    <TableActions />
                </div>
            )}

            {/* Table */}
            <div className="table-wrapper overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <TableHeader />
                    <TableBody />
                </table>
            </div>

            {/* Table Pagination */}
            {config.pagination && (
                <div className="table-pagination mt-4">
                    <TablePagination />
                </div>
            )}
        </div>
    );
};

// Main Table component with provider
export const Table = <T = any>(props: TableProps<T>) => {
    const { config, data, loading, error, ...restProps } = props;

    // Initialize state with external data
    const initialState = {
        data: {
            data: data || [],
            originalData: data || [],
            filteredData: data || [],
            sortedData: data || [],
            loading: loading || false,
            error,
            lastUpdated: Date.now(),
        },
        pagination: {
            page: 1,
            pageSize: config.pagination?.pageSize || 10,
            total: data?.length || 0,
            totalPages: Math.ceil((data?.length || 0) / (config.pagination?.pageSize || 10)),
            hasNextPage: false,
            hasPreviousPage: false,
            startIndex: 0,
            endIndex: 0,
        },
        sorting: {
            sortBy: config.sorting?.defaultSort?.key || '',
            sortOrder: config.sorting?.defaultSort?.direction || 'asc',
            multiSort: [],
            isMultiSort: false,
        },
        filtering: {
            searchTerm: '',
            columnFilters: {},
            advancedFilters: {},
            activeFilters: [],
            filterCount: 0,
        },
        selection: {
            selectedRows: [],
            selectedRowKeys: [],
            selectAll: false,
            indeterminate: false,
            selectionCount: 0,
            lastSelected: undefined,
        },
        ui: {
            columnVisibility: {},
            columnOrder: [],
            columnWidths: {},
            expandedRows: new Set(),
            resizingColumn: undefined,
            draggingColumn: undefined,
            showSettings: false,
            showFilters: false,
            showExport: false,
        },
    } as any;

    return (
        <TableProvider config={config} initialState={initialState}>
            <TableInternal
                {...restProps}
                externalData={data}
                externalLoading={loading}
                externalError={error}
            />
        </TableProvider>
    );
};

// Table with external provider (for advanced usage)
export const TableWithProvider = <T = any>(props: Omit<TableProps<T>, 'config' | 'data' | 'loading' | 'error'>) => {
    return <TableInternal {...props} />;
};

// Export types for external use
export type { TableConfig, TableProps } from '../types';

