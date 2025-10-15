// Enterprise-grade Button component with proper abstractions

import React, { forwardRef } from 'react';
import { BaseComponentProps, useBaseComponent } from './BaseComponent';
import { performanceUtils } from '../../utils';

// Button-specific props interface
export interface ButtonProps extends BaseComponentProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'ghost' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'default' | 'round' | 'circle';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  block?: boolean;
  danger?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
}

// Button component with enterprise-grade features
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = 'button',
      variant = 'primary',
      size = 'md',
      shape = 'default',
      icon,
      iconPosition = 'left',
      loading = false,
      disabled = false,
      block = false,
      danger = false,
      children,
      className,
      testId,
      onClick,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const { className: baseClassName, dataAttributes, handleClick, handleKeyDown } = useBaseComponent({
      variant: danger ? 'error' : variant,
      size,
      disabled: disabled || loading,
      fullWidth: block,
      className,
      testId,
      onClick,
    });

    // Debounced click handler for performance
    const debouncedClick = performanceUtils.debounce(handleClick, 100);

    // Generate button classes
    const buttonClasses = [
      'btn',
      `btn--${variant}`,
      `btn--${size}`,
      `btn--${shape}`,
      block && 'btn--block',
      danger && 'btn--danger',
      loading && 'btn--loading',
      disabled && 'btn--disabled',
      baseClassName,
    ].filter(Boolean).join(' ');

    // Render loading spinner
    const renderLoadingSpinner = () => (
      <svg
        className="btn__spinner"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="btn__spinner-circle"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="31.416"
          strokeDashoffset="31.416"
        >
          <animate
            attributeName="stroke-dasharray"
            dur="2s"
            values="0 31.416;15.708 15.708;0 31.416"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-dashoffset"
            dur="2s"
            values="0;-15.708;-31.416"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    );

    // Render icon
    const renderIcon = () => {
      if (loading) {
        return renderLoadingSpinner();
      }
      return icon;
    };

    // Render content
    const renderContent = () => {
      if (!children && !icon) return null;

      const iconElement = renderIcon();
      const hasIcon = Boolean(iconElement);
      const hasText = Boolean(children);

      if (!hasIcon) {
        return <span className="btn__text">{children}</span>;
      }

      if (!hasText) {
        return <span className="btn__icon-only">{iconElement}</span>;
      }

      return (
        <span className="btn__content">
          {iconPosition === 'left' && (
            <span className="btn__icon btn__icon--left">{iconElement}</span>
          )}
          <span className="btn__text">{children}</span>
          {iconPosition === 'right' && (
            <span className="btn__icon btn__icon--right">{iconElement}</span>
          )}
        </span>
      );
    };

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses}
        disabled={disabled || loading}
        onClick={debouncedClick}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        aria-disabled={disabled || loading}
        aria-busy={loading}
        {...dataAttributes}
        {...props}
      >
        {renderContent()}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Button group component for related buttons
export interface ButtonGroupProps extends BaseComponentProps {
  direction?: 'horizontal' | 'vertical';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
}

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      direction = 'horizontal',
      size = 'md',
      variant = 'primary',
      children,
      className,
      testId,
      ...props
    },
    ref
  ) => {
    const { className: baseClassName, dataAttributes } = useBaseComponent({
      variant,
      size,
      className,
      testId,
    });

    const groupClasses = [
      'btn-group',
      `btn-group--${direction}`,
      `btn-group--${size}`,
      `btn-group--${variant}`,
      baseClassName,
    ].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        className={groupClasses}
        role="group"
        {...dataAttributes}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ButtonGroup.displayName = 'ButtonGroup';

// Export components and types
export default Button;
export type { ButtonProps, ButtonGroupProps };
