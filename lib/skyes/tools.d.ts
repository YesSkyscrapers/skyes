/// <reference types="node" />
import { IncomingMessage } from 'http';
import { CheckUrlResult, Config, RequestObject, ResponseObject } from '../interfaces/interfaces';
declare const getRequestInfo: (httpRequest: IncomingMessage) => Promise<RequestObject>;
declare const getRequestObject: (httpRequest: IncomingMessage) => Promise<RequestObject>;
declare const createResponseObject: (config: Config) => (url: string) => Promise<ResponseObject>;
declare const checkUrlPatterns: (config: Config) => (handlerUrl: string, requestUrl: string) => CheckUrlResult;
declare const getArg: (argName: string) => string | undefined;
export { createResponseObject, getRequestObject, checkUrlPatterns, getRequestInfo, getArg };
