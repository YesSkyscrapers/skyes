import http from 'http'
import fileReadHandler from './handlers/fileReadHandler'
import errorHandler from './handlers/errorHandler'
import disposeHandler from './handlers/disposeHandler'
import healthCheckHandler from './handlers/healthCheckHandler'
import { paramsToObject } from 'skyes/src/tools'

let localServer = {
    start: () => { },
    addAction: () => { },
    addPostAction: () => { },
    addHandler: () => { },
    stop: () => { }
}

const ACTION_TYPE = {
    PRE: 0,
    COMMON: 1,
    POST: 2
}

const DEFAULT_SERVER_START_CONFIG = {
    port: 3030,
    defaultHeaders: {}
}

let serverStartConfig = null;
let server = null;
let actionHandlers = [];
let handlers = [];

const getRequestObject = httpRequest => {
    return new Promise((resolve, reject) => {

        const [url, params, ...notUsed] = httpRequest.url.split('?')

        let requestObject = {
            url: (url.slice(1).endsWith("/") ? url.slice(1).slice(0, -1) : url.slice(1)).toLowerCase(),
            urlParts: url.slice(1).toLowerCase().split('/'),
            paramsObject: paramsToObject(params),
            method: httpRequest.method,
            body: [],
            headers: []
        }

        Object.keys(httpRequest.headers).forEach((key) => {
            const value = httpRequest.headers[key]
            requestObject.headers.push({ key, value })
        })


        httpRequest.on('data', chunk => {
            requestObject.body.push(chunk);
        })
        httpRequest.on('error', (error) => {
            reject(`Body fetching error: ${error}`)
        });
        httpRequest.on('end', () => {
            try {
                try {
                    requestObject.body = JSON.parse(Buffer.concat(requestObject.body).toString());
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

const createResponseObject = () => {
    return new Promise((resolve, reject) => {
        let responseObject = {
            body: {},
            headers: [{
                key: 'Content-Type',
                value: 'application/json'
            }]
        }

        resolve(responseObject);
    })
}

export const processResponse = (httpResponse, responseObject) => {
    Object.keys(serverStartConfig.defaultHeaders).forEach(key => {
        httpResponse.setHeader(key, serverStartConfig.defaultHeaders[key])
    })
    responseObject.headers.forEach(header => {
        httpResponse.setHeader(header.key, header.value)
    })

    httpResponse.end(responseObject.body ? JSON.stringify(responseObject.body) : undefined)
}

const checkUrlPatterns = (handlerUrl, requestUrl) => {
    const splittedHandlerUrl = handlerUrl.split('/')
    const splittedRequestUrl = requestUrl.split('/')
    if (splittedHandlerUrl.length != splittedRequestUrl.length) {
        return [false, {}]
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
        return [result, params]
    }
}

const getDefaultHandlers = (request, response, httpResponse) => {
    let handlersForRequest = []

    handlersForRequest.push({
        url: "action",
        handler: async () => {
            for await (const key of Object.keys(ACTION_TYPE)) {
                const handler = actionHandlers
                    .find(handler => {
                        handler.method = handler.method ? handler.method : "POST"
                        return handler.method == request.method && handler.action == request.body.action && handler.type == ACTION_TYPE[key]
                    })
                if (handler) {
                    await handler.handler(request, response)(handler.entityDefinition)
                } else {
                    if (ACTION_TYPE[key] == ACTION_TYPE.COMMON) {
                        await errorHandler(request, response)("Action not found")
                    }
                }
            }
        },
        useDefaultProcessing: true
    })
    handlersForRequest.push({
        url: "dispose",
        handler: async () => {
            return await disposeHandler(request, httpResponse)
        },
        useDefaultProcessing: false
    })
    handlersForRequest.push({
        url: "healthcheck",
        handler: async () => {
            await healthCheckHandler(request, response)
        },
        useDefaultProcessing: true
    })
    handlersForRequest.push({
        url: "files/{fileId}",
        handler: async () => {
            return await fileReadHandler(request, httpResponse)
        },
        useDefaultProcessing: false
    })
    return handlersForRequest
}

const globalHandler = async (httpRequest, httpResponse) => {

    let response = await createResponseObject()
    let request = null
    try {
        request = await getRequestObject(httpRequest)
        const handlersForRequest = handlers.concat(getDefaultHandlers(request, response, httpResponse))
        const customHandler = handlersForRequest.find(handlerObject => {

            return checkUrlPatterns(handlerObject.url, request.url)[0]
        })
        if (customHandler) {
            if (customHandler.useDefaultProcessing) {
                await customHandler.handler(request, response)
            } else {
                return await (await customHandler.handler(request, httpResponse))(checkUrlPatterns(customHandler.url, request.url)[1])
            }
        } else {
            await errorHandler(request, response)("Handler not found")
        }
    } catch (_error) {
        const error = `Global handler error: ${_error}`
        console.log(error)
        await errorHandler(request, response)(error)
    }
    return processResponse(httpResponse, response)
}

localServer.start = async (config = {}) => {
    try {
        serverStartConfig = {
            ...DEFAULT_SERVER_START_CONFIG,
            ...config
        }
        server = http.createServer(globalHandler)
        await new Promise((resolve, reject) => {
            server.listen(serverStartConfig.port, error => {
                if (error) {
                    reject(`HttpServer listen error: ${error}`)
                } else {
                    console.log(`Skyes started on port: ${serverStartConfig.port}`)
                    resolve();
                }
            })
        })
    } catch (error) {
        throw `LocalServer start failed with error: ${error}`
    }
}

localServer.stop = async () => {
    try {
        await new Promise((resolve, reject) => {
            server.close(() => {
                console.log('Local server stopped')
                resolve();
            })
        })
    } catch (error) {
        throw `LocalServer stop failed with error: ${error}`
    }
}

localServer.addAction = (actionName, handler, entityDefinition, method) => {
    actionHandlers.push({
        action: actionName,
        handler,
        entityDefinition,
        method,
        type: ACTION_TYPE.COMMON
    })
}

localServer.addPostAction = (actionName, handler, entityDefinition, method) => {
    actionHandlers.push({
        action: actionName,
        handler,
        entityDefinition,
        method,
        type: ACTION_TYPE.POST
    })
}

localServer.addHandler = (url, handler, useDefaultProcessing = true) => {
    handlers.push({
        url: url,
        handler,
        useDefaultProcessing
    })
}


export default localServer;