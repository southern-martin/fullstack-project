import { ReactNode } from 'react';
import {
  FilteringState,
  PaginationState,
  SelectionState,
  SortingState,
  TableState,
} from './state.types';

// Core table column definition
export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T, index: number) => ReactNode;
  headerRender?: () => ReactNode;
  className?: string;
  headerClassName?: string;
}

// Pagination configuration
export interface PaginationConfig {
  pageSize?: number;
  pageSizeOptions?: number[];
  showTotal?: boolean;
  showPageSize?: boolean;
  showQuickJumper?: boolean;
  position?: 'top' | 'bottom' | 'both';
}

// Pagination state is defined in state.types.ts

// Sorting configuration
export interface SortingConfig {
  multiSort?: boolean;
  defaultSort?: {
    key: string;
    direction: 'asc' | 'desc';
  };
}

// Sorting state is defined in state.types.ts

// Filtering configuration
export interface FilteringConfig {
  globalSearch?: boolean;
  columnFilters?: boolean;
  advancedFilters?: boolean;
  searchPlaceholder?: string;
}

// Filtering state is defined in state.types.ts

// Selection configuration
export interface SelectionConfig {
  enabled?: boolean;
  multiSelect?: boolean;
  selectAll?: boolean;
  preserveSelection?: boolean;
}

// Selection state is defined in state.types.ts

// Action configuration
export interface ActionConfig<T = any> {
  type: 'row' | 'bulk' | 'table';
  label: string | ((data: T | T[]) => string);
  icon?: ReactNode | ((data: T | T[]) => ReactNode);
  onClick: (data: T | T[], event?: React.MouseEvent) => void;
  disabled?: (data: T | T[]) => boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  className?: string;
}

// Main table configuration
export interface TableConfig<T = any> {
  columns: TableColumn<T>[];
  pagination?: PaginationConfig;
  sorting?: SortingConfig;
  filtering?: FilteringConfig;
  selection?: SelectionConfig;
  actions?: ActionConfig<T>[];
  loading?: boolean;
  emptyMessage?: string;
  errorMessage?: string;
  className?: string;
  rowClassName?: (row: T, index: number) => string;
  onRowClick?: (row: T, index: number) => void;
  onRowDoubleClick?: (row: T, index: number) => void;
}

// Re-export state types from state.types.ts
export type {
  FilteringState,
  PaginationState,
  SelectionState,
  SortingState,
  TableState,
} from './state.types';

// Table context
export interface TableContextValue<T = any> {
  config: TableConfig<T>;
  state: TableState<T>;
  actions: {
    setData: (data: T[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error?: string) => void;
    setPagination: (pagination: Partial<PaginationState>) => void;
    setSorting: (sorting: Partial<SortingState>) => void;
    setFiltering: (filtering: Partial<FilteringState>) => void;
    setSelection: (selection: Partial<SelectionState<T>>) => void;
    setUI: (ui: Partial<any>) => void;
    handleSort: (key: string) => void;
    handleSearch: (searchTerm: string) => void;
    handlePageChange: (page: number) => void;
    handlePageSizeChange: (pageSize: number) => void;
    handleRowSelect: (row: T, selected: boolean) => void;
    handleSelectAll: (selected: boolean) => void;
  };
}

// Table props
export interface TableProps<T = any> {
  config: TableConfig<T>;
  data?: T[];
  loading?: boolean;
  error?: string;
  onDataChange?: (data: T[]) => void;
  onPaginationChange?: (pagination: PaginationState) => void;
  onSortingChange?: (sorting: SortingState) => void;
  onFilteringChange?: (filtering: FilteringState) => void;
  onSelectionChange?: (selection: SelectionState<T>) => void;
  className?: string;
}

// Export configuration
export interface ExportConfig {
  enabled?: boolean;
  formats?: ('csv' | 'excel' | 'pdf')[];
  filename?: string;
  includeHeaders?: boolean;
  customFields?: string[];
}

// Table theme
export interface TableTheme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
    light: string;
    dark: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  };
  borders: {
    radius: string;
    width: string;
    color: string;
  };
}
