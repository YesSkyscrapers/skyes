/// <reference types="node" />
import { IncomingMessage, OutgoingMessage } from 'http';
import { Action } from '../types';
import { AuthModuleInstance } from '../authModule/types';
declare const getActionHandler: (getActions: () => Action<any, any>[], authModule: AuthModuleInstance) => (request: IncomingMessage, response: OutgoingMessage) => Promise<void>;
export { getActionHandler };
