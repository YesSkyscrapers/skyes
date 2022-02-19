import { IncomingMessage, OutgoingMessage } from 'http'
import { RequestObject, ResponseObject } from '../localServer/tools';

interface HttpRequest extends IncomingMessage {

}

interface HttpResponse extends OutgoingMessage {

}

interface HandlerParams {
    httpRequest: HttpRequest;
    request: RequestObject;
    httpResponse: HttpResponse;
    response: ResponseObject;
    handlerParams: any;
}

export default handler;
declare function handler(params: HandlerParams): Promise<void>;
