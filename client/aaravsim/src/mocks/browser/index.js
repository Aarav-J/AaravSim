import { setupWorker } from 'msw';
import { marketHandlers } from '../handlers/marketHandlers';

// Combine all handlers
const allHandlers = [
  ...marketHandlers,
  // Add any other handlers here if needed
];

// Create the MSW worker
export const worker = setupWorker(...allHandlers);