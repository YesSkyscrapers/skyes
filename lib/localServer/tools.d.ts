/// <reference types="node" />
import { IncomingMessage } from 'http';
import { CheckUrlResult, RequestObject, ResponseObject } from '../interfaces/interfaces';
declare const getRequestInfo: (httpRequest: IncomingMessage) => Promise<RequestObject>;
declare const getRequestObject: (httpRequest: IncomingMessage) => Promise<RequestObject>;
declare const createResponseObject: (url: string) => Promise<ResponseObject>;
declare const checkUrlPatterns: (handlerUrl: string, requestUrl: string) => CheckUrlResult;
export { createResponseObject, getRequestObject, checkUrlPatterns, getRequestInfo };
