import { IncomingMessage, OutgoingMessage } from 'http'

interface HttpRequest extends IncomingMessage {

}

interface HttpResponse extends OutgoingMessage {

}

interface ErrorHandlerParams {
    httpRequest: HttpRequest;
    httpResponse: HttpResponse;
    error: any;
}

export function errorHandler(params: ErrorHandlerParams): Promise<void>;
