import { Component, ReactNode } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('🚨 Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleClearStorage = () => {
    try {
      localStorage.removeItem('demo-session');
      console.log('✅ Demo session cleared');
      window.location.reload();
    } catch (error) {
      console.error('Failed to clear storage:', error);
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const error = this.state.error;
      const isAuthError = error?.message.includes('session') || 
                         error?.message.includes('401') ||
                         error?.message.includes('token') ||
                         error?.message.includes('Demo-session');

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-6">
          <Card className="max-w-md w-full p-6 border-red-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-2xl mx-auto mb-4">
                🚨
              </div>
              
              <h2 className="text-xl mb-2 text-red-800">
                {isAuthError ? 'Autentiseringsfel' : 'Något gick fel'}
              </h2>
              
              <p className="text-red-600 text-sm mb-4">
                {isAuthError 
                  ? 'Det verkar som din session har gått ut eller är ogiltig.'
                  : 'Ett oväntat fel inträffade i appen.'
                }
              </p>

              {isAuthError && (
                <Badge className="mb-4 bg-red-100 text-red-800">
                  Session Problem
                </Badge>
              )}

              {error && (
                <details className="mb-6 text-left">
                  <summary className="cursor-pointer text-sm text-gray-600 mb-2">
                    Teknisk information
                  </summary>
                  <div className="bg-gray-100 p-3 rounded text-xs">
                    <div className="mb-2">
                      <strong>Fel:</strong> {error.message}
                    </div>
                    {error.stack && (
                      <div className="text-gray-500 text-xs overflow-auto max-h-32">
                        <strong>Stack:</strong>
                        <pre className="whitespace-pre-wrap">{error.stack}</pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              <div className="space-y-3">
                {isAuthError && (
                  <Button 
                    onClick={this.handleClearStorage}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    🗑️ Rensa session och starta om
                  </Button>
                )}
                
                <Button 
                  onClick={this.handleReload}
                  variant="outline"
                  className="w-full border-red-200 text-red-700 hover:bg-red-50"
                >
                  🔄 Ladda om appen
                </Button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>💡 Tips:</strong> Om problemet kvarstår, använd Auth Diagnostikpanelen 
                  för att identifiera och lösa autentiseringsproblem.
                </p>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export function withErrorBoundary<T extends object>(
  Component: React.ComponentType<T>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: T) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}