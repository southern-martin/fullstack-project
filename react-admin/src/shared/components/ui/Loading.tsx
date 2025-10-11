import React from 'react';

interface LoadingProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
    size = 'md',
    text = 'Loading...',
    fullScreen = false
}) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    };

    const LoadingSpinner = () => (
        <div className="flex flex-col items-center justify-center">
            <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`} />
            {text && (
                <p className="mt-2 text-sm text-gray-600">{text}</p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
                <LoadingSpinner />
            </div>
        );
    }

    return <LoadingSpinner />;
};

export default Loading;








