import React from 'react';

interface CheckboxGroupOption {
    value: string | number;
    label: string;
    description?: string;
}

interface CheckboxGroupProps {
    label: string;
    name: string;
    options: CheckboxGroupOption[];
    selectedValues: (string | number)[];
    onChange: (selectedValues: number[]) => void;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    columns?: 1 | 2 | 3;
    selectAllLabel?: string;
    deselectAllLabel?: string;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
    label,
    name,
    options,
    selectedValues,
    onChange,
    error,
    required = false,
    disabled = false,
    className = '',
    columns = 1,
    selectAllLabel = 'Select All',
    deselectAllLabel = 'Deselect All',
}) => {
    const handleCheckboxChange = (value: string | number) => {
        const numValue = typeof value === 'string' ? parseInt(value) : value;
        
        if (selectedValues.includes(value)) {
            // Remove the value
            onChange(selectedValues.filter(v => v !== value).map(v => typeof v === 'string' ? parseInt(v) : v));
        } else {
            // Add the value
            onChange([...selectedValues.map(v => typeof v === 'string' ? parseInt(v) : v), numValue]);
        }
    };

    const handleSelectAll = () => {
        if (selectedValues.length === options.length) {
            // Deselect all
            onChange([]);
        } else {
            // Select all
            onChange(options.map(opt => typeof opt.value === 'string' ? parseInt(opt.value) : opt.value));
        }
    };

    const gridClass = columns === 3 
        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
        : columns === 2 
        ? 'grid-cols-1 md:grid-cols-2' 
        : 'grid-cols-1';

    const allSelected = options.length > 0 && selectedValues.length === options.length;

    return (
        <div className={className}>
            <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                    {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
                </label>
                {options.length > 1 && (
                    <button
                        type="button"
                        onClick={handleSelectAll}
                        disabled={disabled}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {allSelected ? deselectAllLabel : selectAllLabel}
                    </button>
                )}
            </div>

            <div className={`border rounded-md p-4 bg-white dark:bg-gray-800 ${
                error
                    ? 'border-red-300 dark:border-red-600'
                    : 'border-gray-300 dark:border-gray-600'
            }`}>
                {options.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        No options available
                    </p>
                ) : (
                    <div className={`grid ${gridClass} gap-3`}>
                        {options.map((option) => {
                            const isChecked = selectedValues.includes(option.value);
                            const optionId = `${name}-${option.value}`;

                            return (
                                <div
                                    key={option.value}
                                    className={`relative flex items-start p-3 rounded-lg transition-colors ${
                                        isChecked
                                            ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                                            : 'bg-gray-50 dark:bg-gray-700/50 border border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <div className="flex items-center h-5">
                                        <input
                                            id={optionId}
                                            name={`${name}[]`}
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => handleCheckboxChange(option.value)}
                                            disabled={disabled}
                                            className="h-4 w-4 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <label
                                            htmlFor={optionId}
                                            className={`font-medium text-sm cursor-pointer ${
                                                disabled ? 'cursor-not-allowed opacity-50' : ''
                                            } ${
                                                isChecked
                                                    ? 'text-blue-900 dark:text-blue-100'
                                                    : 'text-gray-900 dark:text-gray-100'
                                            }`}
                                        >
                                            {option.label}
                                        </label>
                                        {option.description && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                {option.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Selection summary */}
            {options.length > 0 && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {selectedValues.length} of {options.length} selected
                </p>
            )}

            {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
};
