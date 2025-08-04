/// <reference types="node" />
import { IncomingMessage, OutgoingMessage } from 'http';
declare const getErrorHandler: (request: IncomingMessage, response: OutgoingMessage, errorMessage: string) => Promise<void>;
export { getErrorHandler };
