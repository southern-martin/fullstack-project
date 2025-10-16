import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useTableContext } from './TableProvider';

export const TableHeader = () => {
    const { config, state, actions } = useTableContext();

    const handleSort = (key: string) => {
        const column = config.columns.find(col => col.key === key);
        if (column?.sortable) {
            actions.handleSort(key);
        }
    };

    const getSortIcon = (key: string) => {
        if (state.sorting.sortBy !== key) {
            return null;
        }

        return state.sorting.sortOrder === 'asc' ? (
            <ChevronUpIcon className="h-4 w-4" />
        ) : (
            <ChevronDownIcon className="h-4 w-4" />
        );
    };

    const getSortClassName = (key: string) => {
        if (state.sorting.sortBy !== key) {
            return 'text-gray-400 dark:text-gray-500';
        }
        return 'text-blue-600 dark:text-blue-400';
    };

    return (
        <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
                {/* Selection column */}
                {config.selection?.enabled && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12">
                        <input
                            type="checkbox"
                            checked={state.selection.selectAll}
                            onChange={(e) => actions.handleSelectAll(e.target.checked)}
                            className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:text-blue-400"
                            aria-label="Select all rows"
                        />
                    </th>
                )}

                {/* Data columns */}
                {config.columns.map((column) => {
                    const isSortable = column.sortable;
                    const isCurrentlySorted = state.sorting.sortBy === column.key;

                    return (
                        <th
                            key={String(column.key)}
                            className={`
                px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider
                ${column.headerClassName || ''}
                ${isSortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none' : ''}
                ${isCurrentlySorted ? 'bg-gray-100 dark:bg-gray-700' : ''}
              `}
                            style={{
                                width: column.width,
                                minWidth: column.minWidth,
                                maxWidth: column.maxWidth,
                                textAlign: column.align || 'left',
                            }}
                            onClick={() => isSortable && handleSort(String(column.key))}
                            aria-sort={
                                isCurrentlySorted
                                    ? state.sorting.sortOrder === 'asc' ? 'ascending' : 'descending'
                                    : isSortable ? 'none' : undefined
                            }
                            title={(column as any).tooltip}
                        >
                            <div className="flex items-center space-x-1">
                                {column.headerRender ? (
                                    column.headerRender()
                                ) : (
                                    <span>{column.label}</span>
                                )}

                                {isSortable && (
                                    <div className={`flex flex-col ${getSortClassName(String(column.key))}`}>
                                        {getSortIcon(String(column.key))}
                                    </div>
                                )}
                            </div>
                        </th>
                    );
                })}

                {/* Actions column */}
                {config.actions && config.actions.some(action => action.type === 'row') && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">
                        Actions
                    </th>
                )}
            </tr>
        </thead>
    );
};
