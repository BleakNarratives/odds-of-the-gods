import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// A simple logging function for the error boundary
const logError = (error: Error, errorInfo: React.ErrorInfo) => {
    // In a real app, you'd send this to a logging service
    console.group("ErrorBoundary Caught an Error");
    console.error(error);
    console.error(errorInfo);
    console.groupEnd();
};

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary logError={logError}>
        <App />
    </ErrorBoundary>
  </React.StrictMode>
);