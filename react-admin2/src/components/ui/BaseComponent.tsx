// Enterprise-grade base component with proper abstractions

import React, { forwardRef, useMemo } from 'react';
import { IBaseComponent } from '../../interfaces';
import { stringUtils } from '../../utils';

// Base component props interface
export interface BaseComponentProps extends IBaseComponent {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

// Base component class for consistent styling and behavior
export abstract class BaseComponent<P extends BaseComponentProps = BaseComponentProps> extends React.Component<P> {
  // Generate consistent class names
  protected getClassName(baseClass: string, props: P): string {
    const classes = [baseClass];
    
    // Add variant class
    if (props.variant) {
      classes.push(`${baseClass}--${props.variant}`);
    }
    
    // Add size class
    if (props.size) {
      classes.push(`${baseClass}--${props.size}`);
    }
    
    // Add state classes
    if (props.disabled) {
      classes.push(`${baseClass}--disabled`);
    }
    
    if (props.loading) {
      classes.push(`${baseClass}--loading`);
    }
    
    if (props.fullWidth) {
      classes.push(`${baseClass}--full-width`);
    }
    
    // Add custom className
    if (props.className) {
      classes.push(props.className);
    }
    
    return classes.filter(Boolean).join(' ');
  }
  
  // Generate data attributes for testing
  protected getDataAttributes(props: P): Record<string, string> {
    const attributes: Record<string, string> = {};
    
    if (props.testId) {
      attributes['data-testid'] = props.testId;
    }
    
    if (props.variant) {
      attributes['data-variant'] = props.variant;
    }
    
    if (props.size) {
      attributes['data-size'] = props.size;
    }
    
    return attributes;
  }
  
  // Handle common events
  protected handleClick = (event: React.MouseEvent) => {
    if (this.props.disabled || this.props.loading) {
      event.preventDefault();
      return;
    }
    
    // Call custom onClick if provided
    if ('onClick' in this.props && typeof this.props.onClick === 'function') {
      (this.props.onClick as (event: React.MouseEvent) => void)(event);
    }
  };
  
  protected handleKeyDown = (event: React.KeyboardEvent) => {
    if (this.props.disabled || this.props.loading) {
      return;
    }
    
    // Handle Enter and Space keys for accessibility
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.handleClick(event as any);
    }
  };
}

// Higher-order component for adding base functionality
export function withBaseComponent<P extends BaseComponentProps>(
  WrappedComponent: React.ComponentType<P>
) {
  return forwardRef<any, P>((props, ref) => {
    const className = useMemo(() => {
      const baseClass = stringUtils.toKebabCase(WrappedComponent.displayName || 'component');
      const classes = [baseClass];
      
      if (props.variant) {
        classes.push(`${baseClass}--${props.variant}`);
      }
      
      if (props.size) {
        classes.push(`${baseClass}--${props.size}`);
      }
      
      if (props.disabled) {
        classes.push(`${baseClass}--disabled`);
      }
      
      if (props.loading) {
        classes.push(`${baseClass}--loading`);
      }
      
      if (props.fullWidth) {
        classes.push(`${baseClass}--full-width`);
      }
      
      if (props.className) {
        classes.push(props.className);
      }
      
      return classes.filter(Boolean).join(' ');
    }, [props.variant, props.size, props.disabled, props.loading, props.fullWidth, props.className]);
    
    const dataAttributes = useMemo(() => {
      const attributes: Record<string, string> = {};
      
      if (props.testId) {
        attributes['data-testid'] = props.testId;
      }
      
      if (props.variant) {
        attributes['data-variant'] = props.variant;
      }
      
      if (props.size) {
        attributes['data-size'] = props.size;
      }
      
      return attributes;
    }, [props.testId, props.variant, props.size]);
    
    return (
      <WrappedComponent
        {...props}
        ref={ref}
        className={className}
        {...dataAttributes}
      />
    );
  });
}

// Hook for base component functionality
export function useBaseComponent<P extends BaseComponentProps>(props: P) {
  const baseClass = useMemo(() => {
    return stringUtils.toKebabCase('component');
  }, []);
  
  const className = useMemo(() => {
    const classes = [baseClass];
    
    if (props.variant) {
      classes.push(`${baseClass}--${props.variant}`);
    }
    
    if (props.size) {
      classes.push(`${baseClass}--${props.size}`);
    }
    
    if (props.disabled) {
      classes.push(`${baseClass}--disabled`);
    }
    
    if (props.loading) {
      classes.push(`${baseClass}--loading`);
    }
    
    if (props.fullWidth) {
      classes.push(`${baseClass}--full-width`);
    }
    
    if (props.className) {
      classes.push(props.className);
    }
    
    return classes.filter(Boolean).join(' ');
  }, [baseClass, props.variant, props.size, props.disabled, props.loading, props.fullWidth, props.className]);
  
  const dataAttributes = useMemo(() => {
    const attributes: Record<string, string> = {};
    
    if (props.testId) {
      attributes['data-testid'] = props.testId;
    }
    
    if (props.variant) {
      attributes['data-variant'] = props.variant;
    }
    
    if (props.size) {
      attributes['data-size'] = props.size;
    }
    
    return attributes;
  }, [props.testId, props.variant, props.size]);
  
  const handleClick = useMemo(() => {
    return (event: React.MouseEvent) => {
      if (props.disabled || props.loading) {
        event.preventDefault();
        return;
      }
      
      if ('onClick' in props && typeof props.onClick === 'function') {
        (props.onClick as (event: React.MouseEvent) => void)(event);
      }
    };
  }, [props.disabled, props.loading, props.onClick]);
  
  const handleKeyDown = useMemo(() => {
    return (event: React.KeyboardEvent) => {
      if (props.disabled || props.loading) {
        return;
      }
      
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick(event as any);
      }
    };
  }, [props.disabled, props.loading, handleClick]);
  
  return {
    className,
    dataAttributes,
    handleClick,
    handleKeyDown,
  };
}

// Export types and utilities
export type { BaseComponentProps };
export { BaseComponent, withBaseComponent, useBaseComponent };
