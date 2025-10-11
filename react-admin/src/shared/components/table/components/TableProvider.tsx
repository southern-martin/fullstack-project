import { createContext, ReactNode, useCallback, useContext, useMemo, useReducer } from 'react';
import {
    FilteringState,
    PaginationState,
    SelectionState,
    SortingState,
    StateAction,
    StateReducer,
    TableConfig,
    TableContextValue,
    TableState
} from '../types';

// Initial state
const createInitialState = <T = any>(): TableState<T> => ({
    data: {
        data: [],
        originalData: [],
        filteredData: [],
        sortedData: [],
        loading: false,
        error: undefined,
        lastUpdated: undefined,
    },
    pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        startIndex: 0,
        endIndex: 0,
    },
    sorting: {
        sortBy: '',
        sortOrder: 'asc',
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
});

// State reducer
const tableReducer = <T = any>(state: TableState<T>, action: StateAction<T>): TableState<T> => {
    switch (action.type) {
        case 'SET_DATA':
            return {
                ...state,
                data: {
                    ...state.data,
                    data: action.payload,
                    originalData: action.payload,
                    filteredData: action.payload,
                    sortedData: action.payload,
                    lastUpdated: Date.now(),
                },
            };

        case 'SET_LOADING':
            return {
                ...state,
                data: {
                    ...state.data,
                    loading: action.payload,
                },
            };

        case 'SET_ERROR':
            return {
                ...state,
                data: {
                    ...state.data,
                    error: action.payload,
                },
            };

        case 'SET_PAGINATION':
            const newPagination = { ...state.pagination, ...action.payload };
            return {
                ...state,
                pagination: {
                    ...newPagination,
                    totalPages: Math.ceil(newPagination.total / newPagination.pageSize),
                    hasNextPage: newPagination.page < Math.ceil(newPagination.total / newPagination.pageSize),
                    hasPreviousPage: newPagination.page > 1,
                    startIndex: (newPagination.page - 1) * newPagination.pageSize + 1,
                    endIndex: Math.min(newPagination.page * newPagination.pageSize, newPagination.total),
                },
            };

        case 'SET_SORTING':
            return {
                ...state,
                sorting: { ...state.sorting, ...action.payload },
            };

        case 'SET_FILTERING':
            const newFiltering = { ...state.filtering, ...action.payload };
            return {
                ...state,
                filtering: {
                    ...newFiltering,
                    filterCount: Object.keys(newFiltering.columnFilters).length +
                        (newFiltering.searchTerm ? 1 : 0) +
                        Object.keys(newFiltering.advancedFilters).length,
                },
            };

        case 'SET_SELECTION':
            const newSelection = { ...state.selection, ...action.payload };
            return {
                ...state,
                selection: {
                    ...newSelection,
                    selectionCount: newSelection.selectedRows.length,
                    indeterminate: newSelection.selectedRows.length > 0 &&
                        newSelection.selectedRows.length < state.data.data.length,
                },
            };

        case 'SET_UI':
            return {
                ...state,
                ui: { ...state.ui, ...action.payload },
            };

        case 'RESET_STATE':
            return createInitialState<T>();

        case 'RESET_FILTERS':
            return {
                ...state,
                filtering: {
                    searchTerm: '',
                    columnFilters: {},
                    advancedFilters: {},
                    activeFilters: [],
                    filterCount: 0,
                },
            };

        case 'RESET_SELECTION':
            return {
                ...state,
                selection: {
                    selectedRows: [],
                    selectedRowKeys: [],
                    selectAll: false,
                    indeterminate: false,
                    selectionCount: 0,
                    lastSelected: undefined,
                },
            };

        case 'RESET_SORTING':
            return {
                ...state,
                sorting: {
                    sortBy: '',
                    sortOrder: 'asc',
                    multiSort: [],
                    isMultiSort: false,
                },
            };

        default:
            return state;
    }
};

// Create context
const TableContext = createContext<TableContextValue<any> | null>(null);

// Provider component
interface TableProviderProps<T = any> {
    config: TableConfig<T>;
    children: ReactNode;
    initialState?: Partial<TableState<T>>;
}

export const TableProvider = <T = any>({
    config,
    children,
    initialState
}: TableProviderProps<T>) => {
    const [state, dispatch] = useReducer(
        tableReducer as StateReducer<T>,
        { ...createInitialState<T>(), ...initialState }
    );

    // Action creators
    const setData = useCallback((data: T[]) => {
        dispatch({ type: 'SET_DATA', payload: data });
    }, []);

    const setLoading = useCallback((loading: boolean) => {
        dispatch({ type: 'SET_LOADING', payload: loading });
    }, []);

    const setError = useCallback((error?: string) => {
        dispatch({ type: 'SET_ERROR', payload: error });
    }, []);

    const setPagination = useCallback((pagination: Partial<PaginationState>) => {
        dispatch({ type: 'SET_PAGINATION', payload: pagination });
    }, []);

    const setSorting = useCallback((sorting: Partial<SortingState>) => {
        dispatch({ type: 'SET_SORTING', payload: sorting });
    }, []);

    const setFiltering = useCallback((filtering: Partial<FilteringState>) => {
        dispatch({ type: 'SET_FILTERING', payload: filtering });
    }, []);

    const setSelection = useCallback((selection: Partial<SelectionState<T>>) => {
        dispatch({ type: 'SET_SELECTION', payload: selection });
    }, []);

    const setUI = useCallback((ui: Partial<any>) => {
        dispatch({ type: 'SET_UI', payload: ui });
    }, []);

    const handleSort = useCallback((key: string) => {
        const currentSort = state.sorting;
        let newSortOrder: 'asc' | 'desc' = 'asc';

        if (currentSort.sortBy === key) {
            newSortOrder = currentSort.sortOrder === 'asc' ? 'desc' : 'asc';
        }

        dispatch({
            type: 'SET_SORTING',
            payload: {
                sortBy: key,
                sortOrder: newSortOrder,
            },
        });
    }, [state.sorting]);

    const handleSearch = useCallback((searchTerm: string) => {
        dispatch({
            type: 'SET_FILTERING',
            payload: { searchTerm },
        });
    }, []);

    const handlePageChange = useCallback((page: number) => {
        dispatch({
            type: 'SET_PAGINATION',
            payload: { page },
        });
    }, []);

    const handlePageSizeChange = useCallback((pageSize: number) => {
        dispatch({
            type: 'SET_PAGINATION',
            payload: { pageSize, page: 1 },
        });
    }, []);

    const handleRowSelect = useCallback((row: T, selected: boolean) => {
        const currentSelection = state.selection;
        let newSelectedRows = [...currentSelection.selectedRows];
        let newSelectedKeys = [...currentSelection.selectedRowKeys];

        if (selected) {
            if (!newSelectedRows.find(item => (item as any).id === (row as any).id)) {
                newSelectedRows.push(row);
                newSelectedKeys.push((row as any).id);
            }
        } else {
            newSelectedRows = newSelectedRows.filter(item => (item as any).id !== (row as any).id);
            newSelectedKeys = newSelectedKeys.filter(key => key !== (row as any).id);
        }

        dispatch({
            type: 'SET_SELECTION',
            payload: {
                selectedRows: newSelectedRows,
                selectedRowKeys: newSelectedKeys,
                lastSelected: row,
            },
        });
    }, [state.selection]);

    const handleSelectAll = useCallback((selected: boolean) => {
        if (selected) {
            dispatch({
                type: 'SET_SELECTION',
                payload: {
                    selectedRows: [...state.data.data],
                    selectedRowKeys: state.data.data.map((item: any) => item.id),
                    selectAll: true,
                },
            });
        } else {
            dispatch({
                type: 'SET_SELECTION',
                payload: {
                    selectedRows: [],
                    selectedRowKeys: [],
                    selectAll: false,
                },
            });
        }
    }, [state.data.data]);

    const actions = useMemo(() => ({
        setData,
        setLoading,
        setError,
        setPagination,
        setSorting,
        setFiltering,
        setSelection,
        setUI,
        handleSort,
        handleSearch,
        handlePageChange,
        handlePageSizeChange,
        handleRowSelect,
        handleSelectAll,
    }), [setData, setLoading, setError, setPagination, setSorting, setFiltering, setSelection, setUI, handleSort, handleSearch, handlePageChange, handlePageSizeChange, handleRowSelect, handleSelectAll]);

    const contextValue: TableContextValue<T> = useMemo(() => ({
        config,
        state,
        actions,
    }), [config, state, actions]);

    return (
        <TableContext.Provider value={contextValue}>
            {children}
        </TableContext.Provider>
    );
};

// Hook to use table context
export const useTableContext = <T = any>(): TableContextValue<T> => {
    const context = useContext(TableContext);
    if (!context) {
        throw new Error('useTableContext must be used within a TableProvider');
    }
    return context;
};

// Hook to use table state
export const useTableState = <T = any>(): TableState<T> => {
    const { state } = useTableContext<T>();
    return state;
};

// Hook to use table actions
export const useTableActions = <T = any>() => {
    const { actions } = useTableContext<T>();
    return actions;
};

// Hook to use table config
export const useTableConfig = <T = any>(): TableConfig<T> => {
    const { config } = useTableContext<T>();
    return config;
};
