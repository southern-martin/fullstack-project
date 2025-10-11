import { useTableContext } from './TableProvider';

export const TableActions = () => {
    const { config, state } = useTableContext();

    const bulkActions = config.actions?.filter(action => action.type === 'bulk') || [];
    const tableActions = config.actions?.filter(action => action.type === 'table') || [];

    const handleBulkAction = (action: any) => {
        if (state.selection.selectedRows.length > 0) {
            action.onClick(state.selection.selectedRows);
        }
    };

    const handleTableAction = (action: any) => {
        action.onClick((state.data as any).data);
    };

    if (bulkActions.length === 0 && tableActions.length === 0) {
        return null;
    }

    return (
        <div className="flex justify-between items-center">
            {/* Bulk actions */}
            {bulkActions.length > 0 && state.selection.selectedRows.length > 0 && (
                <div className="flex space-x-2">
                    <span className="text-sm text-gray-700">
                        {state.selection.selectedRows.length} selected
                    </span>
                    {bulkActions.map((action, index) => (
                        <button
                            key={index}
                            onClick={() => handleBulkAction(action)}
                            disabled={action.disabled ? action.disabled(state.selection.selectedRows) : false}
                            className={`
                inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md
                ${action.variant === 'primary' ? 'text-white bg-blue-600 hover:bg-blue-700' : ''}
                ${action.variant === 'secondary' ? 'text-gray-700 bg-gray-100 hover:bg-gray-200' : ''}
                ${action.variant === 'danger' ? 'text-white bg-red-600 hover:bg-red-700' : ''}
                ${action.variant === 'success' ? 'text-white bg-green-600 hover:bg-green-700' : ''}
                ${!action.variant ? 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50' : ''}
                disabled:opacity-50 disabled:cursor-not-allowed
                ${action.className || ''}
              `}
                        >
                            {action.icon && (
                                <span className="mr-2">
                                    {typeof action.icon === 'function' ? action.icon(state.selection.selectedRows) : action.icon}
                                </span>
                            )}
                            {typeof action.label === 'string' ? action.label : action.label(state.selection.selectedRows)}
                        </button>
                    ))}
                </div>
            )}

            {/* Table actions */}
            {tableActions.length > 0 && (
                <div className="flex space-x-2">
                    {tableActions.map((action, index) => (
                        <button
                            key={index}
                            onClick={() => handleTableAction(action)}
                            disabled={action.disabled ? action.disabled((state.data as any).data) : false}
                            className={`
                inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md
                ${action.variant === 'primary' ? 'text-white bg-blue-600 hover:bg-blue-700' : ''}
                ${action.variant === 'secondary' ? 'text-gray-700 bg-gray-100 hover:bg-gray-200' : ''}
                ${action.variant === 'danger' ? 'text-white bg-red-600 hover:bg-red-700' : ''}
                ${action.variant === 'success' ? 'text-white bg-green-600 hover:bg-green-700' : ''}
                ${!action.variant ? 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50' : ''}
                disabled:opacity-50 disabled:cursor-not-allowed
                ${action.className || ''}
              `}
                        >
                            {action.icon && (
                                <span className="mr-2">
                                    {typeof action.icon === 'function' ? action.icon(state.selection.selectedRows) : action.icon}
                                </span>
                            )}
                            {typeof action.label === 'string' ? action.label : action.label(state.selection.selectedRows)}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
