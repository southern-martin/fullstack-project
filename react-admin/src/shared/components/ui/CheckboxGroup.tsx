import React from 'react';

interface CheckboxGroupProps {
  label: string;
  name: string;
  options: Array<{ value: string; label: string }>;
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
  error?: string;
    disabled?: boolean;
    columns?: number;
    selectAllLabel?: string;
    deselectAllLabel?: string;
  className?: string;
  columns?: number;
  selectAllLabel?: string;
  deselectAllLabel?: string;
  disabled?: boolean;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  name,
  options,
  selectedValues,
  onChange,
  error,
  className = '',
  columns = 1,
  selectAllLabel,
  deselectAllLabel,
  disabled = false,
}: CheckboxGroupProps) => {
  const handleSelectAll = () => {
    onChange(options.map(option => option.value));
  };

  const handleDeselectAll = () => {
    onChange([]);
  };

  const handleCheckboxChange = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {options.map(option => (
          <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name={name}
              value={option.value}
              checked={selectedValues.includes(option.value)}
              onChange={() => handleCheckboxChange(option.value)}
              disabled={disabled}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>

      {selectAllLabel && deselectAllLabel && (
        <div className="flex space-x-4 mt-2">
          <button
            type="button"
            onClick={handleSelectAll}
            disabled={disabled}
            className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
          >
            {selectAllLabel}
          </button>
          <button
            type="button"
            onClick={handleDeselectAll}
            disabled={disabled}
            className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
          >
            {deselectAllLabel}
          </button>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
