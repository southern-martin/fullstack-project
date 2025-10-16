import { useTableContext } from './TableProvider';
import { TableRow } from './TableRow';

export const TableBody = () => {
    const { config, state } = useTableContext();

    // Get the data to display (sorted and filtered)
    const dataState = state.data as any;
    const displayData = dataState.sortedData.length > 0
        ? dataState.sortedData
        : dataState.data;

    // Debug logs removed

    // Apply pagination
    const startIndex = (state.pagination.page - 1) * state.pagination.pageSize;
    const endIndex = startIndex + state.pagination.pageSize;
    const paginatedData = displayData.slice(startIndex, endIndex);

    return (
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.map((row: any, index: number) => (
                <TableRow
                    key={(row as any).id || index}
                    row={row}
                    index={startIndex + index}
                    originalIndex={displayData.findIndex((item: any) => item === row)}
                />
            ))}
        </tbody>
    );
};
