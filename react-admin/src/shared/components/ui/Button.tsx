import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    children,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = 'professional-btn inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none relative overflow-hidden';

    const variantStyles = {
        primary: 'professional-btn-primary',
        secondary: 'professional-btn-secondary',
        danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg',
        success: 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg',
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















