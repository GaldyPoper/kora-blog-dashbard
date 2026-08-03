import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/** MSW server for Node (SSR fetches during dev, and unit tests). */
export const server = setupServer(...handlers);
