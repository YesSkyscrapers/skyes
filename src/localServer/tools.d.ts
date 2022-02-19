import { IncomingMessage } from 'http'

interface HttpRequest extends IncomingMessage {

}

interface Header {
    key: string;
    value: string;
}

interface RequestObject {
    url: string,
    paramsObject: any,
    method: string,
    body: any,
    headers: Array<Header>
}

interface ResponseObject {
    url: string;
    body: any;
    headers: Array<Header>;
    disableProcessing: boolean;
    requestId: number;
}

interface CheckUrlResult {
    result: boolean;
    params: any;
}

export function createResponseObject(url: string): Promise<ResponseObject>;

export function getRequestObject(httpRequest: HttpRequest): Promise<RequestObject>;

export function checkUrlPatterns(handlerUrl: string, requestUrl: string): CheckUrlResult;

