import React from 'react';

export interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    subtitle?: string;
    actions?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
    children,
    className = '',
    title,
    subtitle,
    actions,
}) => {
    return (
        <div className={`professional-card professional-hover-lift ${className}`}>
            {(title || subtitle || actions) && (
                <div className="px-6 py-5 border-b" style={{ borderColor: 'var(--color-border-light)' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            {title && (
                                <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                                    {title}
                                </h3>
                            )}
                            {subtitle && (
                                <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                                    {subtitle}
                                </p>
                            )}
                        </div>
                        {actions && (
                            <div className="flex items-center space-x-2">
                                {actions}
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div className="px-6 py-5">
                {children}
            </div>
        </div>
    );
};

export default Card;

















