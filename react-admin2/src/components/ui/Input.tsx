// Enterprise-grade Input component with proper abstractions

import React, { forwardRef, useCallback, useState } from 'react';
import { validationUtils } from '../../utils';
import { BaseComponentProps, useBaseComponent } from './BaseComponent';

// Input-specific props interface
export interface InputProps extends Omit<BaseComponentProps, 'onClick'> {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local';
  variant?: 'default' | 'filled' | 'outlined' | 'borderless';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  label?: string;
  helperText?: string;
  errorText?: string;
  successText?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  clearable?: boolean;
  showPasswordToggle?: boolean;
  validation?: {
    required?: boolean;
    email?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: string) => string | null;
  };
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onClear?: () => void;
}

// Input component with enterprise-grade features
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      variant = 'default',
      size = 'md',
      placeholder,
      value,
      defaultValue,
      disabled = false,
      readOnly = false,
      required = false,
      autoFocus = false,
      autoComplete,
      maxLength,
      minLength,
      min,
      max,
      step,
      pattern,
      label,
      helperText,
      errorText,
      successText,
      prefix,
      suffix,
      clearable = false,
      showPasswordToggle = false,
      validation,
      className,
      testId,
      onChange,
      onBlur,
      onFocus,
      onKeyDown,
      onKeyUp,
      onClear,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState<string>(defaultValue?.toString() || '');
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    const currentValue = value !== undefined ? value.toString() : internalValue;
    const hasError = Boolean(errorText || validationError);
    const hasSuccess = Boolean(successText);
    const hasHelperText = Boolean(helperText || errorText || successText || validationError);

    const { className: baseClassName, dataAttributes } = useBaseComponent({
      variant: hasError ? 'error' : hasSuccess ? 'success' : variant,
      size,
      disabled,
      className,
      testId,
    });

    // Validation function
    const validateInput = useCallback((inputValue: string): string | null => {
      if (!validation) return null;

      // Required validation
      if (validation.required && !validationUtils.isRequired(inputValue)) {
        return 'This field is required';
      }

      // Email validation
      if (validation.email && inputValue && !validationUtils.isValidEmail(inputValue)) {
        return 'Please enter a valid email address';
      }

      // Min length validation
      if (validation.minLength && !validationUtils.hasMinLength(inputValue, validation.minLength)) {
        return `Minimum length is ${validation.minLength} characters`;
      }

      // Max length validation
      if (validation.maxLength && !validationUtils.hasMaxLength(inputValue, validation.maxLength)) {
        return `Maximum length is ${validation.maxLength} characters`;
      }

      // Pattern validation
      if (validation.pattern && inputValue && !validation.pattern.test(inputValue)) {
        return 'Invalid format';
      }

      // Custom validation
      if (validation.custom) {
        return validation.custom(inputValue);
      }

      return null;
    }, [validation]);

    // Handle input change
    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;

      if (value === undefined) {
        setInternalValue(newValue);
      }

      // Validate input
      if (validation) {
        const error = validateInput(newValue);
        setValidationError(error);
      }

      onChange?.(newValue, event);
    }, [value, validation, validateInput, onChange]);

    // Handle blur
    const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);

      // Validate on blur
      if (validation) {
        const error = validateInput(currentValue);
        setValidationError(error);
      }

      onBlur?.(event);
    }, [validation, validateInput, currentValue, onBlur]);

    // Handle focus
    const handleFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(event);
    }, [onFocus]);

    // Handle clear
    const handleClear = useCallback(() => {
      if (value === undefined) {
        setInternalValue('');
      }
      setValidationError(null);
      onClear?.();
    }, [value, onClear]);

    // Toggle password visibility
    const togglePasswordVisibility = useCallback(() => {
      setShowPassword(prev => !prev);
    }, []);

    // Generate input classes
    const inputClasses = [
      'input',
      `input--${variant}`,
      `input--${size}`,
      hasError && 'input--error',
      hasSuccess && 'input--success',
      disabled && 'input--disabled',
      readOnly && 'input--readonly',
      isFocused && 'input--focused',
      prefix && 'input--with-prefix',
      suffix && 'input--with-suffix',
      clearable && 'input--clearable',
      showPasswordToggle && 'input--with-password-toggle',
    ].filter(Boolean).join(' ');

    // Generate wrapper classes
    const wrapperClasses = [
      'input-wrapper',
      `input-wrapper--${variant}`,
      `input-wrapper--${size}`,
      hasError && 'input-wrapper--error',
      hasSuccess && 'input-wrapper--success',
      disabled && 'input-wrapper--disabled',
      isFocused && 'input-wrapper--focused',
      baseClassName,
    ].filter(Boolean).join(' ');

    // Determine input type
    const inputType = type === 'password' && showPassword ? 'text' : type;

    // Render prefix
    const renderPrefix = () => {
      if (!prefix) return null;
      return <span className="input__prefix">{prefix}</span>;
    };

    // Render suffix
    const renderSuffix = () => {
      if (!suffix && !clearable && !showPasswordToggle) return null;

      return (
        <span className="input__suffix">
          {suffix}
          {clearable && currentValue && (
            <button
              type="button"
              className="input__clear"
              onClick={handleClear}
              aria-label="Clear input"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
          {showPasswordToggle && type === 'password' && (
            <button
              type="button"
              className="input__password-toggle"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          )}
        </span>
      );
    };

    // Render helper text
    const renderHelperText = () => {
      if (!hasHelperText) return null;

      const text = errorText || successText || validationError || helperText;
      const className = [
        'input__helper-text',
        errorText || validationError ? 'input__helper-text--error' : '',
        successText ? 'input__helper-text--success' : '',
      ].filter(Boolean).join(' ');

      return <span className={className}>{text}</span>;
    };

    return (
      <div className={wrapperClasses} {...dataAttributes}>
        {label && (
          <label className="input__label">
            {label}
            {required && <span className="input__required">*</span>}
          </label>
        )}
        <div className="input__container">
          {renderPrefix()}
          <input
            ref={ref}
            type={inputType}
            className={inputClasses}
            placeholder={placeholder}
            value={currentValue}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            autoFocus={autoFocus}
            autoComplete={autoComplete}
            maxLength={maxLength}
            minLength={minLength}
            min={min}
            max={max}
            step={step}
            pattern={pattern}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            aria-invalid={hasError}
            aria-describedby={hasHelperText ? `${testId}-helper` : undefined}
            {...props}
          />
          {renderSuffix()}
        </div>
        {renderHelperText()}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Export component and types
export default Input;
