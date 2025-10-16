import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({ className = '', children, ...props }) => {
    const classes = `text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300 ${className}`;

    return (
        <label className={classes} {...props}>
            {children}
        </label>
    );
};

export { Label };







