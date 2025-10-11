// Table state management types

// Base state interface
export interface BaseState {
  loading: boolean;
  error?: string;
  lastUpdated?: number;
}

// Data state
export interface DataState<T = any> extends BaseState {
  data: T[];
  originalData: T[];
  filteredData: T[];
  sortedData: T[];
}

// Pagination state with additional metadata
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startIndex: number;
  endIndex: number;
}

// Sorting state with multi-sort support
export interface SortingState {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  multiSort: Array<{
    key: string;
    direction: 'asc' | 'desc';
    priority: number;
  }>;
  isMultiSort: boolean;
}

// Filtering state with different filter types
export interface FilteringState {
  searchTerm: string;
  columnFilters: Record<
    string,
    {
      value: any;
      operator:
        | 'equals'
        | 'contains'
        | 'startsWith'
        | 'endsWith'
        | 'gt'
        | 'lt'
        | 'gte'
        | 'lte'
        | 'in'
        | 'notIn';
      type: 'text' | 'number' | 'date' | 'select' | 'boolean';
    }
  >;
  advancedFilters: Record<string, any>;
  activeFilters: string[];
  filterCount: number;
}

// Selection state with additional metadata
export interface SelectionState<T = any> {
  selectedRows: T[];
  selectedRowKeys: (string | number)[];
  selectAll: boolean;
  indeterminate: boolean;
  selectionCount: number;
  lastSelected?: T;
}

// Table state with all sub-states
export interface TableState<T = any> {
  data: DataState<T>;
  pagination: PaginationState;
  sorting: SortingState;
  filtering: FilteringState;
  selection: SelectionState<T>;
  ui: UIState;
}

// UI state for table interface
export interface UIState {
  columnVisibility: Record<string, boolean>;
  columnOrder: string[];
  columnWidths: Record<string, number>;
  expandedRows: Set<string | number>;
  resizingColumn?: string;
  draggingColumn?: string;
  showSettings: boolean;
  showFilters: boolean;
  showExport: boolean;
}

// State action types
export type StateAction<T = any> =
  | { type: 'SET_DATA'; payload: T[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | undefined }
  | { type: 'SET_PAGINATION'; payload: Partial<PaginationState> }
  | { type: 'SET_SORTING'; payload: Partial<SortingState> }
  | { type: 'SET_FILTERING'; payload: Partial<FilteringState> }
  | { type: 'SET_SELECTION'; payload: Partial<SelectionState<T>> }
  | { type: 'SET_UI'; payload: Partial<UIState> }
  | { type: 'RESET_STATE' }
  | { type: 'RESET_FILTERS' }
  | { type: 'RESET_SELECTION' }
  | { type: 'RESET_SORTING' };

// State reducer type
export type StateReducer<T = any> = (
  state: TableState<T>,
  action: StateAction<T>
) => TableState<T>;

// State selector types
export type StateSelector<T = any, R = any> = (state: TableState<T>) => R;

// State subscription types
export type StateSubscription<T = any> = (state: TableState<T>) => void;

// State persistence types
export interface StatePersistence {
  key: string;
  version: number;
  persist: (state: Partial<TableState>) => void;
  restore: () => Partial<TableState> | null;
  clear: () => void;
}

// State validation types
export interface StateValidation<T = any> {
  validate: (state: TableState<T>) => boolean;
  errors: string[];
  warnings: string[];
}

// State middleware types
export type StateMiddleware<T = any> = (
  state: TableState<T>,
  action: StateAction<T>,
  next: (action: StateAction<T>) => TableState<T>
) => TableState<T>;

// State configuration
export interface StateConfig<T = any> {
  initialState?: Partial<TableState<T>>;
  persistence?: StatePersistence;
  validation?: StateValidation<T>;
  middleware?: StateMiddleware<T>[];
  devtools?: boolean;
}

// State hook return type
export interface UseTableStateReturn<T = any> {
  state: TableState<T>;
  dispatch: (action: StateAction<T>) => void;
  select: <R>(selector: StateSelector<T, R>) => R;
  subscribe: (subscription: StateSubscription<T>) => () => void;
  reset: () => void;
  resetFilters: () => void;
  resetSelection: () => void;
  resetSorting: () => void;
}

