import React from 'react';

interface LoadingSpinnerProps {
    message?: string;
    subMessage?: string;
    size?: 'sm' | 'md' | 'lg';
    showProgress?: boolean;
    error?: Error | null;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    message = 'Loading...',
    subMessage,
    size = 'md',
    showProgress = false,
    error = null,
}) => {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-12 w-12',
        lg: 'h-16 w-16',
    };

    const textSizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    };

    return (
        <div className="flex items-center justify-center p-12">
            <div className="text-center">
                {/* Enhanced spinner with better styling */}
                <div className="relative">
                    <div className={`animate-spin rounded-full ${sizeClasses[size]} border-4 border-gray-200 mx-auto mb-4`}></div>
                    <div className={`animate-spin rounded-full ${sizeClasses[size]} border-4 border-blue-600 border-t-transparent absolute top-0 left-1/2 transform -translate-x-1/2 mb-4`}></div>
                </div>

                {/* Loading text with animation */}
                <div className="space-y-2">
                    <p className={`text-gray-700 font-medium ${textSizeClasses[size]}`}>{message}</p>
                    {subMessage && (
                        <p className="text-gray-500 text-sm">{subMessage}</p>
                    )}

                    {/* Progress indicator */}
                    {showProgress && (
                        <div className="w-48 bg-gray-200 rounded-full h-2 mx-auto mt-4">
                            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                        </div>
                    )}
                </div>

                {/* Error display */}
                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-600 text-sm">
                            ⚠️ Error: {error.message}
                        </p>
                        <p className="text-red-500 text-xs mt-1">
                            Please try again or contact support if the problem persists
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoadingSpinner;







