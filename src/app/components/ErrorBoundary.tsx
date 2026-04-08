import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#efeeb6] via-white to-[#b7b094] dark:from-[#2D0D25] dark:via-[#63335A] dark:to-[#2D2F26] p-6">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">⚠️</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Coś poszło nie tak
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Wystąpił nieoczekiwany błąd. Spróbuj odświeżyć stronę.
              </p>
              {this.state.error && process.env.NODE_ENV === 'development' && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 mb-4 text-left">
                  <p className="text-sm font-mono text-red-800 dark:text-red-300 break-all">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-gradient-to-r from-olive-600 to-olive-700 dark:from-violet-500 dark:to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Powrót do strony głównej
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}