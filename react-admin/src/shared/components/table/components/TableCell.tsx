import React from 'react';
import { TableColumn } from '../types';

interface TableCellProps {
    column: TableColumn;
    row: any;
    index: number;
    originalIndex: number;
}

export const TableCell: React.FC<TableCellProps> = ({
    column,
    row,
    index,
    originalIndex
}) => {
    // Get the raw value from the row
    const rawValue = (row as any)[column.key];

    // Render the cell content
    const renderCellContent = () => {
        if (column.render) {
            return column.render(rawValue, row, originalIndex);
        }

        // Default rendering based on value type
        if (rawValue === null || rawValue === undefined) {
            return <span className="text-gray-400">-</span>;
        }

        if (typeof rawValue === 'boolean') {
            return (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${rawValue
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                    {rawValue ? 'Yes' : 'No'}
                </span>
            );
        }

        if (typeof rawValue === 'object' && rawValue !== null) {
            // Handle arrays (like roles)
            if (Array.isArray(rawValue)) {
                if (rawValue.length === 0) {
                    return <span className="text-gray-400">None</span>;
                }

                return (
                    <div className="flex flex-wrap gap-1">
                        {rawValue.map((item, itemIndex) => (
                            <span
                                key={itemIndex}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                                {typeof item === 'object' ? item.name || item.label || JSON.stringify(item) : String(item)}
                            </span>
                        ))}
                    </div>
                );
            }

            // Handle objects
            return (
                <span className="text-sm text-gray-900">
                    {rawValue.name || rawValue.label || rawValue.title || JSON.stringify(rawValue)}
                </span>
            );
        }

        // Handle dates
        if (rawValue instanceof Date || (typeof rawValue === 'string' && !isNaN(Date.parse(rawValue)))) {
            const date = new Date(rawValue);
            return (
                <span className="text-sm text-gray-900">
                    {date.toLocaleDateString()}
                </span>
            );
        }

        // Handle numbers
        if (typeof rawValue === 'number') {
            return (
                <span className="text-sm text-gray-900 font-mono">
                    {rawValue.toLocaleString()}
                </span>
            );
        }

        // Handle strings
        return (
            <span className="text-sm text-gray-900">
                {String(rawValue)}
            </span>
        );
    };

    return (
        <td
            className={`
        px-6 py-4 whitespace-nowrap text-sm
        ${column.className || ''}
      `}
            style={{
                textAlign: column.align || 'left',
                width: column.width,
                minWidth: column.minWidth,
                maxWidth: column.maxWidth,
            }}
            title={(column as any).tooltip}
        >
            {renderCellContent()}
        </td>
    );
};
