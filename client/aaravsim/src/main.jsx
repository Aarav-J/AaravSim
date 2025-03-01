import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import './styles/index.scss';

// Initialize MSW in development only
async function startMockServiceWorker() {
  if (process.env.NODE_ENV === 'development') {
    try {
      const { worker } = await import('./mocks/browser');
      return worker.start({
        onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
      });
    } catch (error) {
      console.error('Error starting MSW:', error);
    }
  }
  return Promise.resolve();
}

// Start the app after MSW is initialized
startMockServiceWorker().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});