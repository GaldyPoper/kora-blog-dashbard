import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/** MSW worker for the browser (client-side fetches during dev). */
export const worker = setupWorker(...handlers);
