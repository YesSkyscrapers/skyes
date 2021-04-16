import http from 'http'
import fileReadHandler from './handlers/fileReadHandler'
import errorHandler from './handlers/errorHandler'
import disposeHandler from './handlers/disposeHandler'
import healthCheckHandler from './handlers/healthCheckHandler'
import { paramsToObject } from 'skyes/src/tools'

let localServer = {
    start: () => { },
    addAction: () => { },
    addHandler: () => { },
    stop: () => { }
}

const DEFAULT_SERVER_START_CONFIG = {
    port: 3030
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
                requestObject.body = JSON.parse(Buffer.concat(requestObject.body).toString());
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
    responseObject.headers.forEach(header => {
        httpResponse.setHeader(header.key, header.value)
    })

    httpResponse.end(responseObject.body ? JSON.stringify(responseObject.body) : undefined)
}

const globalHandler = async (httpRequest, httpResponse) => {

    let response = await createResponseObject()
    let request = null
    try {
        request = await getRequestObject(httpRequest)

        const customHandler = handlers.find(handlerObject => {
            return handlerObject.url == request.url
        })

        if (customHandler) {
            await customHandler.handler(request, response)
        } else {
            switch (request.url) {
                case 'action': {
                    const handler = actionHandlers
                        .find(handler => {
                            handler.method = handler.method ? handler.method : "POST"
                            return handler.method == request.method && handler.action == request.body.action
                        })
                    if (handler) {
                        await handler.handler(request, response)(handler.entityDefinition)
                    } else {
                        await errorHandler(request, response)("Action not found")
                    }
                    break;
                }
                case 'dispose': {
                    return await disposeHandler(request, response)(httpResponse)
                    break;
                }
                case 'healthcheck': {
                    await healthCheckHandler(request, response)
                    break;
                }
                default: {

                    switch (request.urlParts[0]) {

                        case "files": {
                            return await fileReadHandler(request, response)(httpResponse)
                            break;
                        }

                        default: {
                            await errorHandler(request, response)("Handler not found")
                            break;
                        }
                    }

                    break;
                }
            }
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
        method
    })
}
localServer.addHandler = (url, handler) => {
    handlers.push({
        url: url,
        handler
    })
}


export default localServer;