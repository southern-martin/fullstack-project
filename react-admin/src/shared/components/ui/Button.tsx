import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    fullWidth?: boolean;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    children,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = 'professional-btn inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 relative overflow-hidden';

    const variantStyles = {
        primary: 'professional-btn-primary',
        secondary: 'professional-btn-secondary',
        danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500 shadow-md hover:shadow-lg dark:from-red-600 dark:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800',
        success: 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 focus:ring-green-500 shadow-md hover:shadow-lg dark:from-green-600 dark:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800',
    };

    const sizeStyles = {
        sm: 'px-3 py-2 text-sm rounded-lg',
        md: 'px-4 py-2.5 text-base rounded-lg',
        lg: 'px-6 py-3 text-lg rounded-xl',
    };

    const disabledStyles = 'opacity-50 cursor-not-allowed transform-none';

    const classes = [
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? 'professional-btn-full' : '',
        disabled || isLoading ? disabledStyles : '',
        className,
    ].join(' ');

    return (
        <button
            className={classes}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <div className="professional-spinner -ml-1 mr-2 h-4 w-4"></div>
            )}
            {children}
        </button>
    );
};

export default Button;

















