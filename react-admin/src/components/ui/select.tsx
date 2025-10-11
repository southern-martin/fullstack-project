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
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
            {children}
        </button>
    );
};

interface SelectValueProps {
    placeholder?: string;
}

const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => {
    return <span className="text-muted-foreground">{placeholder}</span>;
};

interface SelectContentProps {
    children: React.ReactNode;
    onSelect?: (value: string) => void;
}

const SelectContent: React.FC<SelectContentProps> = ({ children, onSelect }) => {
    return (
        <div className="absolute top-full z-50 w-full mt-1 bg-popover text-popover-foreground border border-border rounded-md shadow-md">
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
            className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
            {children}
        </button>
    );
};

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };

