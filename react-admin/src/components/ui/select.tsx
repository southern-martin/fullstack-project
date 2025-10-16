import React, { useEffect, useRef, useState } from 'react';

interface SelectProps {
    value?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ value, onValueChange, disabled, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={selectRef} className="relative">
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    if (child.type === SelectTrigger) {
                        return React.cloneElement(child as React.ReactElement<any>, {
                            isOpen,
                            onToggle: () => !disabled && setIsOpen(!isOpen),
                            value,
                        });
                    }
                    if (child.type === SelectContent) {
                        return isOpen ? React.cloneElement(child as React.ReactElement<any>, {
                            onSelect: (selectedValue: string) => {
                                onValueChange?.(selectedValue);
                                setIsOpen(false);
                            },
                        }) : null;
                    }
                }
                return child;
            })}
        </div>
    );
};

interface SelectTriggerProps {
    children: React.ReactNode;
    isOpen?: boolean;
    onToggle?: () => void;
    value?: string;
}

const SelectTrigger: React.FC<SelectTriggerProps> = ({ children, isOpen, onToggle, value }) => {
    return (
        <button
            type="button"
            onClick={onToggle}
            className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-blue-400 dark:focus:border-blue-400"
        >
            {children}
        </button>
    );
};

interface SelectValueProps {
    placeholder?: string;
}

const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => {
    return <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>;
};

interface SelectContentProps {
    children: React.ReactNode;
    onSelect?: (value: string) => void;
}

const SelectContent: React.FC<SelectContentProps> = ({ children, onSelect }) => {
    return (
        <div className="absolute top-full z-50 w-full mt-1 bg-white text-gray-900 border border-gray-300 rounded-md shadow-md dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600">
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child) && child.type === SelectItem) {
                    return React.cloneElement(child as React.ReactElement<any>, { onSelect });
                }
                return child;
            })}
        </div>
    );
};

interface SelectItemProps {
    value: string;
    children: React.ReactNode;
    onSelect?: (value: string) => void;
}

const SelectItem: React.FC<SelectItemProps> = ({ value, children, onSelect }) => {
    return (
        <button
            type="button"
            onClick={() => onSelect?.(value)}
            className="w-full px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
        >
            {children}
        </button>
    );
};

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };

