import { useCallback, useMemo } from 'react';
import { useTableContext } from '../components/TableProvider';

export interface UseTableSelectionOptions<T = any> {
  onSelectionChange?: (
    selectedItems: T[],
    selectedKeys: (string | number)[]
  ) => void;
  onSelectAll?: (selected: boolean) => void;
  onItemSelect?: (item: T, selected: boolean) => void;
  getItemKey?: (item: T) => string | number;
  maxSelection?: number;
  minSelection?: number;
  allowEmptySelection?: boolean;
}

export interface UseTableSelectionReturn<T = any> {
  // Selection state
  selectedItems: T[];
  selectedKeys: (string | number)[];
  selectAll: boolean;
  indeterminate: boolean;
  selectionCount: number;

  // Selection actions
  selectItem: (item: T) => void;
  deselectItem: (item: T) => void;
  toggleItem: (item: T) => void;
  selectAllItems: () => void;
  deselectAllItems: () => void;
  toggleSelectAll: () => void;

  // Selection utilities
  isSelected: (item: T) => boolean;
  isItemSelected: (key: string | number) => boolean;
  canSelect: (item: T) => boolean;
  canDeselect: (item: T) => boolean;
  canSelectAll: () => boolean;
  canDeselectAll: () => boolean;

  // Selection validation
  isValidSelection: boolean;
  selectionErrors: string[];
}

export const useTableSelection = <T = any>(
  options: UseTableSelectionOptions<T> = {}
): UseTableSelectionReturn<T> => {
  const {
    onSelectionChange,
    onSelectAll,
    onItemSelect,
    getItemKey = (item: any) => item.id,
    maxSelection,
    minSelection = 0,
    allowEmptySelection = true,
  } = options;

  const { state, actions } = useTableContext<T>();

  // Get current selection state
  const selectedItems = state.selection.selectedRows;
  const selectedKeys = state.selection.selectedRowKeys;
  const selectAll = state.selection.selectAll;
  const indeterminate = state.selection.indeterminate;
  const selectionCount = state.selection.selectionCount;

  // Get all available items
  const allItems = (state.data as any).data;

  // Check if item is selected
  const isSelected = useCallback(
    (item: T) => {
      const key = getItemKey(item);
      return selectedKeys.includes(key);
    },
    [selectedKeys, getItemKey]
  );

  // Check if key is selected
  const isItemSelected = useCallback(
    (key: string | number) => {
      return selectedKeys.includes(key);
    },
    [selectedKeys]
  );

  // Check if item can be selected
  const canSelect = useCallback(
    (item: T) => {
      if (isSelected(item)) return false;
      if (maxSelection && selectionCount >= maxSelection) return false;
      return true;
    },
    [isSelected, maxSelection, selectionCount]
  );

  // Check if item can be deselected
  const canDeselect = useCallback(
    (item: T) => {
      if (!isSelected(item)) return false;
      if (!allowEmptySelection && selectionCount <= minSelection) return false;
      return true;
    },
    [isSelected, allowEmptySelection, selectionCount, minSelection]
  );

  // Check if all items can be selected
  const canSelectAll = useCallback(() => {
    if (selectAll) return false;
    if (maxSelection && allItems.length > maxSelection) return false;
    return true;
  }, [selectAll, maxSelection, allItems.length]);

  // Check if all items can be deselected
  const canDeselectAll = useCallback(() => {
    if (!selectAll && selectionCount === 0) return false;
    if (!allowEmptySelection && allItems.length <= minSelection) return false;
    return true;
  }, [
    selectAll,
    selectionCount,
    allowEmptySelection,
    allItems.length,
    minSelection,
  ]);

  // Select item
  const selectItem = useCallback(
    (item: T) => {
      if (!canSelect(item)) return;

      actions.handleRowSelect(item, true);
      onItemSelect?.(item, true);
      onSelectionChange?.(
        selectedItems.concat(item),
        selectedKeys.concat(getItemKey(item))
      );
    },
    [
      canSelect,
      actions,
      onItemSelect,
      onSelectionChange,
      selectedItems,
      selectedKeys,
      getItemKey,
    ]
  );

  // Deselect item
  const deselectItem = useCallback(
    (item: T) => {
      if (!canDeselect(item)) return;

      actions.handleRowSelect(item, false);
      onItemSelect?.(item, false);

      const newSelectedItems = selectedItems.filter(
        selectedItem => getItemKey(selectedItem) !== getItemKey(item)
      );
      const newSelectedKeys = selectedKeys.filter(
        key => key !== getItemKey(item)
      );

      onSelectionChange?.(newSelectedItems, newSelectedKeys);
    },
    [
      canDeselect,
      actions,
      onItemSelect,
      onSelectionChange,
      selectedItems,
      selectedKeys,
      getItemKey,
    ]
  );

  // Toggle item selection
  const toggleItem = useCallback(
    (item: T) => {
      if (isSelected(item)) {
        deselectItem(item);
      } else {
        selectItem(item);
      }
    },
    [isSelected, selectItem, deselectItem]
  );

  // Select all items
  const selectAllItems = useCallback(() => {
    if (!canSelectAll()) return;

    actions.handleSelectAll(true);
    onSelectAll?.(true);
    onSelectionChange?.(allItems, allItems.map(getItemKey));
  }, [
    canSelectAll,
    actions,
    onSelectAll,
    onSelectionChange,
    allItems,
    getItemKey,
  ]);

  // Deselect all items
  const deselectAllItems = useCallback(() => {
    if (!canDeselectAll()) return;

    actions.handleSelectAll(false);
    onSelectAll?.(false);
    onSelectionChange?.([], []);
  }, [canDeselectAll, actions, onSelectAll, onSelectionChange]);

  // Toggle select all
  const toggleSelectAll = useCallback(() => {
    if (selectAll || indeterminate) {
      deselectAllItems();
    } else {
      selectAllItems();
    }
  }, [selectAll, indeterminate, selectAllItems, deselectAllItems]);

  // Selection validation
  const isValidSelection = useMemo(() => {
    if (selectionCount < minSelection) return false;
    if (maxSelection && selectionCount > maxSelection) return false;
    return true;
  }, [selectionCount, minSelection, maxSelection]);

  // Selection errors
  const selectionErrors = useMemo(() => {
    const errors: string[] = [];

    if (selectionCount < minSelection) {
      errors.push(`Minimum ${minSelection} items must be selected`);
    }

    if (maxSelection && selectionCount > maxSelection) {
      errors.push(`Maximum ${maxSelection} items can be selected`);
    }

    return errors;
  }, [selectionCount, minSelection, maxSelection]);

  return {
    selectedItems,
    selectedKeys,
    selectAll,
    indeterminate,
    selectionCount,
    selectItem,
    deselectItem,
    toggleItem,
    selectAllItems,
    deselectAllItems,
    toggleSelectAll,
    isSelected,
    isItemSelected,
    canSelect,
    canDeselect,
    canSelectAll,
    canDeselectAll,
    isValidSelection,
    selectionErrors,
  };
};

