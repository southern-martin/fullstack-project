// Enterprise-grade Error Boundary component

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { errorLogger } from '../../utils/logger';
import { Button } from '../ui';

// Error boundary props interface
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

// Error boundary state interface
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

// Error boundary component
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    });

    // Log error
    errorLogger.logError(error, errorInfo);

    // Call custom error handler
    this.props.onError?.(error, errorInfo);

    // Auto-reset after 5 seconds if enabled
    if (this.props.resetOnPropsChange) {
      this.resetTimeoutId = window.setTimeout(() => {
        this.resetErrorBoundary();
      }, 5000);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    const { resetKeys } = this.props;
    const { hasError } = this.state;

    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (this.hasArrayChanged(prevProps.resetKeys, resetKeys)) {
        this.resetErrorBoundary();
      }
    }
  }

  componentWillUnmount(): void {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  private hasArrayChanged(prevArray?: Array<string | number>, nextArray?: Array<string | number>): boolean {
    if (!prevArray || !nextArray) return false;
    if (prevArray.length !== nextArray.length) return true;
    
    return prevArray.some((item, index) => item !== nextArray[index]);
  }

  private resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    });
  };

  private handleRetry = (): void => {
    this.resetErrorBoundary();
  };

  private handleReportError = (): void => {
    const { error, errorInfo, errorId } = this.state;
    
    // In a real application, you would send this to your error reporting service
    console.log('Reporting error:', {
      errorId,
      error: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
    });

    // You could also open a support ticket or send an email
    alert('Error has been reported. Our team will investigate and fix it soon.');
  };

  private renderFallback(): ReactNode {
    const { fallback } = this.props;
    const { error, errorId } = this.state;

    if (fallback) {
      return fallback;
    }

    return (
      <div className="error-boundary">
        <div className="error-boundary__container">
          <div className="error-boundary__icon">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          
          <h1 className="error-boundary__title">Something went wrong</h1>
          
          <p className="error-boundary__message">
            We're sorry, but something unexpected happened. Our team has been notified and is working to fix this issue.
          </p>

          {process.env.NODE_ENV === 'development' && error && (
            <details className="error-boundary__details">
              <summary className="error-boundary__summary">Error Details (Development)</summary>
              <div className="error-boundary__error">
                <h4>Error ID: {errorId}</h4>
                <pre className="error-boundary__stack">
                  {error.message}
                  {error.stack && `\n\n${error.stack}`}
                </pre>
              </div>
            </details>
          )}

          <div className="error-boundary__actions">
            <Button
              variant="primary"
              onClick={this.handleRetry}
              className="error-boundary__retry"
            >
              Try Again
            </Button>
            
            <Button
              variant="secondary"
              onClick={this.handleReportError}
              className="error-boundary__report"
            >
              Report Issue
            </Button>
          </div>

          <div className="error-boundary__help">
            <p>
              If this problem persists, please contact our support team with the error ID: <strong>{errorId}</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.renderFallback();
    }

    return this.props.children;
  }
}

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

// Hook for error boundary functionality
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    errorLogger.logError(error, errorInfo);
  };
}

// Export components and utilities
export default ErrorBoundary;
export type { ErrorBoundaryProps, ErrorBoundaryState };
