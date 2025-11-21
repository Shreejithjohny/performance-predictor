import React, { ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component to catch React errors
 * Prevents entire app from crashing
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // You can also log to external service here
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background">
          <div className="max-w-md w-full mx-4">
            <div className="bg-card rounded-lg border border-border p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-12 w-12 text-destructive flex-shrink-0" />
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    Something went wrong
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    {this.state.error.message || 'An unexpected error occurred. Please try again.'}
                  </p>
                  <div className="space-y-2">
                    <Button onClick={this.resetError} className="w-full">
                      Try Again
                    </Button>
                    <Button variant="outline" onClick={() => window.location.href = '/'} className="w-full">
                      Go to Home
                    </Button>
                  </div>
                </div>
              </div>

              {/* Dev only - remove in production */}
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-6 pt-6 border-t border-border">
                  <summary className="cursor-pointer text-sm font-mono text-muted-foreground hover:text-foreground">
                    Error Details
                  </summary>
                  <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto text-destructive">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
