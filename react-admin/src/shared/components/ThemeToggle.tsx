import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useTheme } from '../../app/providers/ThemeProvider';

interface ThemeToggleProps {
    className?: string;
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
    className = '',
    showLabel = false,
    size = 'md'
}) => {
    const { theme, toggleTheme } = useTheme();

    const handleToggle = () => {
        toggleTheme();
    };

    const sizeClasses = {
        sm: 'h-8 w-8 p-1.5',
        md: 'h-10 w-10 p-2',
        lg: 'h-12 w-12 p-2.5'
    };

    const iconSizes = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6'
    };

    return (
        <button
            onClick={handleToggle}
            className={`
        relative inline-flex items-center justify-center
        rounded-lg border border-gray-200 bg-white text-gray-600
        shadow-sm transition-all duration-200
        hover:bg-gray-50 hover:text-gray-900 hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300
        dark:hover:bg-gray-700 dark:hover:text-white
        ${sizeClasses[size]}
        ${className}
      `}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
            <div className="relative">
                {/* Sun Icon */}
                <SunIcon
                    className={`
            ${iconSizes[size]} transition-all duration-300
            ${theme === 'light'
                            ? 'rotate-0 scale-100 opacity-100'
                            : 'rotate-90 scale-0 opacity-0'
                        }
          `}
                />

                {/* Moon Icon */}
                <MoonIcon
                    className={`
            absolute top-0 left-0 ${iconSizes[size]} transition-all duration-300
            ${theme === 'dark'
                            ? 'rotate-0 scale-100 opacity-100'
                            : '-rotate-90 scale-0 opacity-0'
                        }
          `}
                />
            </div>

            {showLabel && (
                <span className="ml-2 text-sm font-medium">
                    {theme === 'light' ? 'Dark' : 'Light'}
                </span>
            )}
        </button>
    );
};

export default ThemeToggle;
