import { setupWorker } from 'msw';
import { marketHandlers } from '../handlers/marketHandlers';

// Add any other handlers you have
const handlers = [
  ...marketHandlers,
  // ...your other handlers
];

// This configures a Service Worker with the given request handlers
export const worker = setupWorker(...handlers);