import { ReactNode } from 'react';

// Column alignment options
export type ColumnAlign = 'left' | 'center' | 'right';

// Column width options
export type ColumnWidth = string | number;

// Column render function types
export type ColumnRenderFunction<T = any> = (
  value: any,
  row: T,
  index: number
) => ReactNode;

export type ColumnHeaderRenderFunction = () => ReactNode;

// Column filter types
export interface ColumnFilter {
  type: 'text' | 'select' | 'date' | 'number' | 'boolean';
  options?: Array<{ label: string; value: any }>;
  placeholder?: string;
  multiple?: boolean;
}

// Column sort configuration
export interface ColumnSortConfig {
  enabled: boolean;
  priority?: number;
  customSort?: (a: any, b: any) => number;
}

// Column visibility configuration
export interface ColumnVisibilityConfig {
  visible: boolean;
  locked?: boolean;
  order?: number;
}

// Enhanced column definition
export interface EnhancedTableColumn<T = any> {
  // Basic properties
  key: keyof T | string;
  label: string;

  // Display properties
  width?: ColumnWidth;
  minWidth?: ColumnWidth;
  maxWidth?: ColumnWidth;
  align?: ColumnAlign;
  className?: string;
  headerClassName?: string;

  // Functionality
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  draggable?: boolean;
  visible?: boolean;

  // Rendering
  render?: ColumnRenderFunction<T>;
  headerRender?: ColumnHeaderRenderFunction;

  // Advanced features
  filter?: ColumnFilter;
  sortConfig?: ColumnSortConfig;
  visibilityConfig?: ColumnVisibilityConfig;

  // Accessibility
  ariaLabel?: string;
  headerAriaLabel?: string;

  // Tooltip
  tooltip?: string;
  headerTooltip?: string;

  // Styling
  style?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
}

// Column group definition
export interface ColumnGroup<T = any> {
  key: string;
  label: string;
  columns: EnhancedTableColumn<T>[];
  className?: string;
  headerClassName?: string;
  align?: ColumnAlign;
}

// Column configuration for different data types
export interface ColumnTypeConfig {
  string: {
    defaultWidth: number;
    defaultAlign: ColumnAlign;
    defaultFilter: ColumnFilter;
  };
  number: {
    defaultWidth: number;
    defaultAlign: ColumnAlign;
    defaultFilter: ColumnFilter;
  };
  boolean: {
    defaultWidth: number;
    defaultAlign: ColumnAlign;
    defaultFilter: ColumnFilter;
  };
  date: {
    defaultWidth: number;
    defaultAlign: ColumnAlign;
    defaultFilter: ColumnFilter;
  };
  object: {
    defaultWidth: number;
    defaultAlign: ColumnAlign;
    defaultFilter: ColumnFilter;
  };
}

// Column utility types
export type ColumnKey<T = any> = keyof T | string;
export type ColumnValue<T = any> = T[ColumnKey<T> & keyof T];

// Column comparison function
export type ColumnCompareFunction<T = any> = (
  a: T,
  b: T,
  column: EnhancedTableColumn<T>
) => number;

// Column validation function
export type ColumnValidationFunction<T = any> = (
  value: any,
  row: T,
  column: EnhancedTableColumn<T>
) => boolean | string;

// Column transformation function
export type ColumnTransformFunction<T = any> = (
  value: any,
  row: T,
  column: EnhancedTableColumn<T>
) => any;
