import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  logError: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.props.logError(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center text-center bg-theme-background text-white p-4">
            <div className="bg-black/50 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-2xl shadow-red-500/20 border border-red-500/50 max-w-2xl">
                <h1 className="text-4xl font-bold text-red-400">A Cosmic Disturbance Occurred</h1>
                <p className="mt-4 text-slate-300">
                    The fabric of reality has torn. The Architect has been notified of this anomaly.
                    Please refresh the realm to continue your journey.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-8 bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-500 transition-colors"
                >
                    Refresh the Realm
                </button>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;