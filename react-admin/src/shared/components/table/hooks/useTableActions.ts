import { useCallback, useState } from 'react';
import { useTableContext } from '../components/TableProvider';

export interface UseTableActionsOptions<T = any> {
  onCreate?: (data: Partial<T>) => Promise<T>;
  onUpdate?: (id: string | number, data: Partial<T>) => Promise<T>;
  onDelete?: (id: string | number) => Promise<void>;
  onBulkDelete?: (ids: (string | number)[]) => Promise<void>;
  onToggleStatus?: (id: string | number, status: boolean) => Promise<T>;
  onExport?: (data: T[], format: 'csv' | 'excel' | 'pdf') => Promise<void>;
  confirmDelete?: boolean;
  confirmBulkDelete?: boolean;
  onSuccess?: (action: string, data?: any) => void;
  onError?: (action: string, error: Error) => void;
}

export interface UseTableActionsReturn<T = any> {
  // CRUD operations
  createItem: (data: Partial<T>) => Promise<T | null>;
  updateItem: (id: string | number, data: Partial<T>) => Promise<T | null>;
  deleteItem: (id: string | number) => Promise<boolean>;
  toggleStatus: (id: string | number, status: boolean) => Promise<T | null>;

  // Bulk operations
  bulkDelete: (ids: (string | number)[]) => Promise<boolean>;

  // Export operations
  exportData: (format: 'csv' | 'excel' | 'pdf') => Promise<void>;

  // State
  loading: boolean;
  error: string | null;

  // Utility functions
  confirmAction: (message: string, onConfirm: () => void) => void;
}

export const useTableCRUDActions = <T = any>(
  options: UseTableActionsOptions<T> = {}
): UseTableActionsReturn<T> => {
  const {
    onCreate,
    onUpdate,
    onDelete,
    onBulkDelete,
    onToggleStatus,
    onExport,
    confirmDelete = true,
    confirmBulkDelete = true,
    onSuccess,
    onError,
  } = options;

  const { state, actions } = useTableContext<T>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generic action handler
  const handleAction = useCallback(
    async <R>(
      action: () => Promise<R>,
      actionName: string,
      successData?: any
    ): Promise<R | null> => {
      try {
        setLoading(true);
        setError(null);

        const result = await action();

        onSuccess?.(actionName, successData);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        onError?.(actionName, err as Error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [onSuccess, onError]
  );

  // Create item
  const createItem = useCallback(
    async (data: Partial<T>): Promise<T | null> => {
      if (!onCreate) {
        setError('Create function not provided');
        return null;
      }

      return handleAction(() => onCreate(data), 'create', data);
    },
    [onCreate, handleAction]
  );

  // Update item
  const updateItem = useCallback(
    async (id: string | number, data: Partial<T>): Promise<T | null> => {
      if (!onUpdate) {
        setError('Update function not provided');
        return null;
      }

      return handleAction(() => onUpdate(id, data), 'update', { id, data });
    },
    [onUpdate, handleAction]
  );

  // Delete item
  const deleteItem = useCallback(
    async (id: string | number): Promise<boolean> => {
      if (!onDelete) {
        setError('Delete function not provided');
        return false;
      }

      if (confirmDelete) {
        return new Promise(resolve => {
          confirmAction(
            'Are you sure you want to delete this item?',
            async () => {
              const result = await handleAction(() => onDelete(id), 'delete', {
                id,
              });
              resolve(result !== null);
            }
          );
        });
      }

      const result = await handleAction(() => onDelete(id), 'delete', { id });
      return result !== null;
    },
    [onDelete, handleAction, confirmDelete]
  );

  // Toggle status
  const toggleStatus = useCallback(
    async (id: string | number, status: boolean): Promise<T | null> => {
      if (!onToggleStatus) {
        setError('Toggle status function not provided');
        return null;
      }

      return handleAction(() => onToggleStatus(id, status), 'toggleStatus', {
        id,
        status,
      });
    },
    [onToggleStatus, handleAction]
  );

  // Bulk delete
  const bulkDelete = useCallback(
    async (ids: (string | number)[]): Promise<boolean> => {
      if (!onBulkDelete) {
        setError('Bulk delete function not provided');
        return false;
      }

      if (confirmBulkDelete) {
        return new Promise(resolve => {
          confirmAction(
            `Are you sure you want to delete ${ids.length} items?`,
            async () => {
              const result = await handleAction(
                () => onBulkDelete(ids),
                'bulkDelete',
                { ids }
              );
              resolve(result !== null);
            }
          );
        });
      }

      const result = await handleAction(() => onBulkDelete(ids), 'bulkDelete', {
        ids,
      });
      return result !== null;
    },
    [onBulkDelete, handleAction, confirmBulkDelete]
  );

  // Export data
  const exportData = useCallback(
    async (format: 'csv' | 'excel' | 'pdf'): Promise<void> => {
      if (!onExport) {
        setError('Export function not provided');
        return;
      }

      const data = (state.data as any).data;
      await handleAction(() => onExport(data, format), 'export', {
        format,
        count: data.length,
      });
    },
    [onExport, handleAction, state.data]
  );

  // Confirm action utility
  const confirmAction = useCallback(
    (message: string, onConfirm: () => void) => {
      if (window.confirm(message)) {
        onConfirm();
      }
    },
    []
  );

  return {
    createItem,
    updateItem,
    deleteItem,
    toggleStatus,
    bulkDelete,
    exportData,
    loading,
    error,
    confirmAction,
  };
};
