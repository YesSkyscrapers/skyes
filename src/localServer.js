import http from 'http'
import readHandler from './handlers/readHandler'
import errorHandler from './handlers/errorHandler'

let localServer = {
    start: () => { }
}

const DEFAULT_SERVER_START_CONFIG = {
    port: 3030
}

let serverStartConfig = null;
let server = null;
let handlers = [];

const getRequestObject = httpRequest => {
    return new Promise((resolve, reject) => {
        let requestObject = {
            url: httpRequest.url,
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
            requestObject.body = Buffer.concat(requestObject.body).toString();
            resolve(requestObject);
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

const processResponse = (httpResponse, responseObject) => {
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
        // if (request) {
        //     const onlyUrl = request.url.split('?')[0]
        //     const handlerNames = onlyUrl.split('/');
        //     const handlerName = handlerNames[1]
        //     switch (handlerName) {
        //         case 'ping': {
        //             return pingHandler(request, response)
        //         }
        //         case 'feed': {
        //             if (handlerNames[2] && handlerNames[2] == 'posts') {
        //                 return feedPostHandler(request, response)
        //             } else {
        //                 return listPreHandler(feedHandler, errorHandler)(request, response)
        //             }
        //         }
        //         default: {
        //             return errorHandler(request, response)
        //         }
        //     }
        // } else {
        //     return errorHandler(request, response)
        // }
        throw 'someErr0r'
    } catch (error) {
        console.log(`Global handler error: ${error}`)
        errorHandler(request, response)(error)
    }
    return processResponse(httpResponse, response)
}

localServer.start = async (config = {}) => {
    try {
        handlers.push(readHandler)
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


export default localServer;