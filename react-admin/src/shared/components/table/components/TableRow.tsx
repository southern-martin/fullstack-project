import React from 'react';
import { TableCell } from './TableCell';
import { useTableContext } from './TableProvider';

interface TableRowProps {
    row: any;
    index: number;
    originalIndex: number;
}

export const TableRow: React.FC<TableRowProps> = ({ row, index, originalIndex }) => {
    const { config, state, actions } = useTableContext();

    const isSelected = state.selection.selectedRowKeys.includes((row as any).id);
    const isExpanded = state.ui.expandedRows.has((row as any).id);

    const handleRowClick = () => {
        if (config.onRowClick) {
            config.onRowClick(row, originalIndex);
        }
    };

    const handleRowDoubleClick = () => {
        if (config.onRowDoubleClick) {
            config.onRowDoubleClick(row, originalIndex);
        }
    };

    const handleSelectionChange = (selected: boolean) => {
        actions.handleRowSelect(row, selected);
    };

    const getRowClassName = () => {
        const baseClass = 'hover:bg-gray-50 transition-colors duration-150';
        const selectedClass = isSelected ? 'bg-blue-50 border-blue-200' : '';
        const customClass = config.rowClassName ? config.rowClassName(row, originalIndex) : '';
        const clickableClass = (config.onRowClick || config.onRowDoubleClick) ? 'cursor-pointer' : '';

        return `${baseClass} ${selectedClass} ${customClass} ${clickableClass}`.trim();
    };

    return (
        <tr
            className={getRowClassName()}
            onClick={handleRowClick}
            onDoubleClick={handleRowDoubleClick}
            aria-selected={isSelected}
            role="row"
        >
            {/* Selection cell */}
            {config.selection?.enabled && (
                <td className="px-6 py-4 whitespace-nowrap">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectionChange(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        aria-label={`Select row ${index + 1}`}
                        onClick={(e) => e.stopPropagation()}
                    />
                </td>
            )}

            {/* Data cells */}
            {config.columns.map((column) => (
                <TableCell
                    key={String(column.key)}
                    column={column}
                    row={row}
                    index={index}
                    originalIndex={originalIndex}
                />
            ))}

            {/* Actions cell */}
            {config.actions && config.actions.some(action => action.type === 'row') && (
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                        {config.actions
                            .filter(action => action.type === 'row')
                            .map((action, actionIndex) => (
                                <button
                                    key={actionIndex}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        action.onClick(row, e);
                                    }}
                                    disabled={action.disabled ? action.disabled(row) : false}
                                    className={`
                    inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded
                    ${action.variant === 'primary' ? 'text-white bg-blue-600 hover:bg-blue-700' : ''}
                    ${action.variant === 'secondary' ? 'text-gray-700 bg-gray-100 hover:bg-gray-200' : ''}
                    ${action.variant === 'danger' ? 'text-white bg-red-600 hover:bg-red-700' : ''}
                    ${action.variant === 'success' ? 'text-white bg-green-600 hover:bg-green-700' : ''}
                    ${!action.variant ? 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50' : ''}
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${action.className || ''}
                  `}
                                    title={typeof action.label === 'string' ? action.label : action.label(row)}
                                >
                                    {action.icon && (
                                        <span className="mr-1">
                                            {typeof action.icon === 'function' ? action.icon(row) : action.icon}
                                        </span>
                                    )}
                                    {typeof action.label === 'string' ? action.label : action.label(row)}
                                </button>
                            ))}
                    </div>
                </td>
            )}
        </tr>
    );
};
