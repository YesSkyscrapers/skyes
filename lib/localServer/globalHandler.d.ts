/// <reference types="node" />
import { AddHandlerParams } from '../interfaces/interfaces';
import { IncomingMessage, OutgoingMessage } from 'http';
declare const addHandler: (params: AddHandlerParams) => void;
declare const globalHandler: (httpRequest: IncomingMessage, httpResponse: OutgoingMessage) => Promise<void>;
export { globalHandler, addHandler };
