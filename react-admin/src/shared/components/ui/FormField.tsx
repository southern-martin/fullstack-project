import React from 'react';

interface FormFieldProps {
    label: string;
    name: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    error,
    placeholder,
    required = false,
    disabled = false,
    className = '',
}) => {
    return (
        <div className={className}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
                type={type}
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 sm:text-sm ${error
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

interface SelectFieldProps {
    label: string;
    name: string;
    value: string | number | string[] | number[];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: Array<{ value: string | number; label: string }>;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    multiple?: boolean;
    className?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
    label,
    name,
    value,
    onChange,
    options,
    error,
    required = false,
    disabled = false,
    multiple = false,
    className = '',
}) => {
    return (
        <div className={className}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
                name={name}
                id={name}
                value={Array.isArray(value) ? value.map(String) : String(value)}
                onChange={onChange}
                disabled={disabled}
                multiple={multiple}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 sm:text-sm ${error
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

interface CheckboxFieldProps {
    label: string;
    name: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    className?: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
    label,
    name,
    checked,
    onChange,
    error,
    className = '',
}) => {
    return (
        <div className={className}>
            <div className="flex items-center">
                <input
                    id={name}
                    name={name}
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={name} className="ml-2 block text-sm text-gray-900">
                    {label}
                </label>
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};
