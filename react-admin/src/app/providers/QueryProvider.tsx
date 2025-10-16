import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { ReactNode } from 'react';

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Time in milliseconds that data remains fresh
            staleTime: 5 * 60 * 1000, // 5 minutes
            // Time in milliseconds that unused/inactive cache data remains in memory
            gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
            // Retry failed requests
            retry: (failureCount, error: any) => {
                // Don't retry on 4xx errors (client errors)
                if (error?.status >= 400 && error?.status < 500) {
                    return false;
                }
                // Retry up to 3 times for other errors
                return failureCount < 3;
            },
            // Retry delay with exponential backoff
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Refetch on window focus
            refetchOnWindowFocus: true,
            // Refetch on reconnect
            refetchOnReconnect: true,
            // Refetch on mount
            refetchOnMount: true,
        },
        mutations: {
            // Retry failed mutations
            retry: (failureCount, error: any) => {
                // Don't retry on 4xx errors (client errors)
                if (error?.status >= 400 && error?.status < 500) {
                    return false;
                }
                // Retry up to 2 times for other errors
                return failureCount < 2;
            },
            // Retry delay for mutations
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
        },
    },
});

interface QueryProviderProps {
    children: ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {/* Only show devtools in development */}
            {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools
                    initialIsOpen={false}
                />
            )}
        </QueryClientProvider>
    );
};

// Export the query client for use in other parts of the app
export { queryClient };
