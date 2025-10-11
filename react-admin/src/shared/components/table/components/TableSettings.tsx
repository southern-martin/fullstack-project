import {
    AdjustmentsHorizontalIcon,
    ArrowDownIcon,
    ArrowUpIcon,
    EyeIcon,
    EyeSlashIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import React, { useCallback, useState } from 'react';

// Removed useTableContext import - component will work with props

interface TableSettingsProps {
    isOpen: boolean;
    onClose: () => void;
    onExport?: (format: 'csv' | 'excel' | 'pdf') => void;
    columns?: any[];
    pagination?: any;
    onPageSizeChange?: (pageSize: number) => void;
}

export const TableSettings: React.FC<TableSettingsProps> = ({
    isOpen,
    onClose,
    onExport,
    columns = [],
    pagination,
    onPageSizeChange,
}) => {
    const [activeTab, setActiveTab] = useState<'columns' | 'export' | 'display'>('columns');

    // Column visibility management
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});

    const toggleColumnVisibility = useCallback((columnKey: string) => {
        setColumnVisibility(prev => ({
            ...prev,
            [columnKey]: !prev[columnKey],
        }));
    }, []);

    // Column ordering
    const [columnOrder, setColumnOrder] = useState<string[]>([]);

    const moveColumn = useCallback((columnKey: string, direction: 'up' | 'down') => {
        const currentOrder = columnOrder.length > 0
            ? columnOrder
            : columns.map(col => String(col.key));

        const currentIndex = currentOrder.indexOf(columnKey);
        if (currentIndex === -1) return;

        const newOrder = [...currentOrder];
        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

        if (newIndex >= 0 && newIndex < newOrder.length) {
            [newOrder[currentIndex], newOrder[newIndex]] = [newOrder[newIndex], newOrder[currentIndex]];
            setColumnOrder(newOrder);
        }
    }, [columnOrder, columns]);

    // Reset settings
    const resetSettings = useCallback(() => {
        setColumnVisibility({});
        setColumnOrder([]);
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                        <AdjustmentsHorizontalIcon className="h-6 w-6 text-gray-600" />
                        <h2 className="text-xl font-semibold text-gray-900">Table Settings</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <XMarkIcon className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    {[
                        { key: 'columns', label: 'Columns', icon: EyeIcon },
                        { key: 'export', label: 'Export', icon: ArrowDownIcon },
                        { key: 'display', label: 'Display', icon: AdjustmentsHorizontalIcon },
                    ].map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key as any)}
                            className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === key
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Icon className="h-4 w-4" />
                            <span>{label}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {activeTab === 'columns' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900">Column Management</h3>
                                <button
                                    onClick={resetSettings}
                                    className="text-sm text-blue-600 hover:text-blue-700"
                                >
                                    Reset to Default
                                </button>
                            </div>

                            <div className="space-y-2">
                                {columns.map((column, index) => {
                                    const columnKey = String(column.key);
                                    const isVisible = columnVisibility[columnKey] !== false;

                                    return (
                                        <div
                                            key={columnKey}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    onClick={() => toggleColumnVisibility(columnKey)}
                                                    className={`p-1 rounded ${isVisible
                                                        ? 'text-blue-600 hover:bg-blue-100'
                                                        : 'text-gray-400 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {isVisible ? (
                                                        <EyeIcon className="h-4 w-4" />
                                                    ) : (
                                                        <EyeSlashIcon className="h-4 w-4" />
                                                    )}
                                                </button>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {column.label}
                                                </span>
                                            </div>

                                            <div className="flex items-center space-x-1">
                                                <button
                                                    onClick={() => moveColumn(columnKey, 'up')}
                                                    disabled={index === 0}
                                                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <ArrowUpIcon className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => moveColumn(columnKey, 'down')}
                                                    disabled={index === columns.length - 1}
                                                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <ArrowDownIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {activeTab === 'export' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">Export Data</h3>
                            <p className="text-sm text-gray-600">
                                Export the current table data in various formats.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { format: 'csv', label: 'CSV', description: 'Comma-separated values' },
                                    { format: 'excel', label: 'Excel', description: 'Microsoft Excel format' },
                                    { format: 'pdf', label: 'PDF', description: 'Portable Document Format' },
                                ].map(({ format, label, description }) => (
                                    <button
                                        key={format}
                                        onClick={() => onExport?.(format as any)}
                                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                                    >
                                        <div className="font-medium text-gray-900">{label}</div>
                                        <div className="text-sm text-gray-600">{description}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'display' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">Display Options</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Page Size
                                    </label>
                                    <select
                                        value={pagination?.pageSize || 10}
                                        onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {[5, 10, 25, 50, 100].map(size => (
                                            <option key={size} value={size}>
                                                {size} items per page
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={pagination?.showTotal || false}
                                            onChange={(e) => {
                                                // This would need to be handled by the parent component
                                                // as it requires updating the table config
                                            }}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">Show total count</span>
                                    </label>
                                </div>

                                <div>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={pagination?.showPageSize || false}
                                            onChange={(e) => {
                                                // This would need to be handled by the parent component
                                            }}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">Show page size selector</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
