import { paramsToObject } from "../tools"

export const getRequestObject = httpRequest => {
    return new Promise((resolve, reject) => {
        const [_url, params, ...notUsed] = httpRequest.url.split('?')

        let url = _url
        if (url.startsWith('/')) {
            url = url.slice(1)
        }
        if (url.endsWith('/')) {
            url = url.slice(0, -1)
        }

        let requestObject = {
            url: url,
            paramsObject: paramsToObject(params),
            method: httpRequest.method,
            body: {},
            headers: []
        }
        let rawBody = []

        Object.keys(httpRequest.headers).forEach((key) => {
            const value = httpRequest.headers[key]
            requestObject.headers.push({ key, value })
        })

        httpRequest.on('error', (error) => {
            reject(`Body fetching error: ${error}`)
        });

        httpRequest.on('data', chunk => {
            rawBody.push(chunk);
        })
        httpRequest.on('end', () => {
            try {
                try {
                    requestObject.body = JSON.parse(Buffer.concat(rawBody).toString());
                } catch (error) {
                    requestObject.body = {}
                }
                resolve(requestObject);
            } catch (error) {
                reject(`JSON parse error: ${error}`)
            }
        })
    })
}

export const createResponseObject = () => {
    return new Promise((resolve, reject) => {
        let responseObject = {
            body: {},
            headers: [{
                key: 'Content-Type',
                value: 'application/json'
            }],
            disableProcessing: false
        }

        resolve(responseObject);
    })
}

export const checkUrlPatterns = (handlerUrl, requestUrl) => {
    const splittedHandlerUrl = handlerUrl.split('/')
    const splittedRequestUrl = requestUrl.split('/')
    if (splittedHandlerUrl.length != splittedRequestUrl.length) {
        return {
            result: false,
            params: {}
        }
    } else {
        let result = true;
        let params = {};
        splittedHandlerUrl.forEach((handlerPart, index) => {
            if (handlerPart.startsWith("{") && handlerPart.endsWith("}")) {
                params[handlerPart.slice(1, -1)] = splittedRequestUrl[index]
            } else {
                if (handlerPart != splittedRequestUrl[index]) {
                    result = false;
                }
            }
        })
        return { result, params }
    }
}