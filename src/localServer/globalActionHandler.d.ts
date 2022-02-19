import { IncomingMessage, OutgoingMessage } from 'http'
import { RequestObject, ResponseObject } from './tools';

interface HttpRequest extends IncomingMessage {

}

interface HttpResponse extends OutgoingMessage {

}

interface AddActionParams {
    name: string;
    action: string;
}

export function addAction(params: AddActionParams): void;

interface GlobalActionHandlerParams {
    httpRequest: HttpRequest;
    request: RequestObject;
    httpResponse: HttpResponse;
    response: ResponseObject;
    handlerParams: any;
}

export function globalActionHandler(params: GlobalActionHandlerParams): Promise<void>;

interface ProcessResponseParams {
    httpRequest: HttpRequest;
    request: RequestObject;
    httpResponse: HttpResponse;
    response: ResponseObject;
    handlerParams: any;
}

export function processResponse(params: ProcessResponseParams): Promise<void>;
