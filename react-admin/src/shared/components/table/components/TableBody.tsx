import { useTableContext } from './TableProvider';
import { TableRow } from './TableRow';

export const TableBody = () => {
    const { state } = useTableContext();

    // Get the data to display (sorted and filtered)
    const dataState = state.data as any;
    
    // Ensure we always have an array for displayData
    let displayData: any[] = [];
    
    if (dataState) {
        if (Array.isArray(dataState.sortedData) && dataState.sortedData.length > 0) {
            displayData = dataState.sortedData;
        } else if (Array.isArray(dataState.data)) {
            displayData = dataState.data;
        } else if (dataState.data && typeof dataState.data === 'object' && 'data' in dataState.data) {
            // Handle nested data structure {data: {data: []}}
            displayData = Array.isArray(dataState.data.data) ? dataState.data.data : [];
        }
    }

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
