import { IncomingMessage, OutgoingMessage } from 'http'

interface HttpRequest extends IncomingMessage {

}

interface HttpResponse extends OutgoingMessage {

}

interface AddHandlerParams {
    url: string;
    method: string;
    handler: Promise<any>;
}

export function addHandler(params: AddHandlerParams): void;

export function globalHandler(httpRequest: HttpRequest, httpResponse: HttpResponse): Promise<void>;
