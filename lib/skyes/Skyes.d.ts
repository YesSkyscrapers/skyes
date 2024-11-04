/// <reference types="node" />
import { Server as HttpServer, IncomingMessage, OutgoingMessage } from 'http';
import { AddActionParams, AddHandlerParams, CheckUrlResult, Config, ErrorHandlerParams, GlobalActionHandlerParams, ResponseObject } from '../interfaces/interfaces';
declare class Skyes {
    serverConfig: Config;
    httpServer: HttpServer;
    port: number;
    handlers: AddHandlerParams[];
    actions: AddActionParams[];
    errorHandler: (params: ErrorHandlerParams) => Promise<void>;
    createResponseObject: (url: string) => Promise<ResponseObject>;
    checkUrlPatterns: (handlerUrl: string, requestUrl: string) => CheckUrlResult;
    constructor(config: Config);
    getDefaultHandlers: (config: Config) => {
        url: string;
        method: string;
        handler: (params: GlobalActionHandlerParams) => Promise<void>;
    }[];
    serverHandler: (httpRequest: IncomingMessage, httpResponse: OutgoingMessage) => Promise<void>;
    start: () => Promise<void>;
    stop: () => Promise<void>;
    addAction: (params: AddActionParams) => void;
    addHandler: (params: AddHandlerParams) => void;
    getConfig: () => Config;
}
export default Skyes;
