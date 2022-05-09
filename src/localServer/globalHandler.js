
import { errorHandler } from "./errorHandler"
import { globalActionHandler } from "./globalActionHandler"
import disposeHandler from "../handlers/disposeHandler"
import healthCheckHandler from "../handlers/healthCheckHandler"
import { checkUrlPatterns, createResponseObject, getRequestInfo, getRequestObject } from "./tools"

let handlers = []

const addHandler = ({
    url,
    method,
    handler,
    parseBody
}) => {
    if (url == 'action') {
        throw 'Action handler reserved'
    } else {

        handlers.push({
            url,
            method,
            handler,
            parseBody
        })
    }
}

const checkDefaultHandlers = () => {
    if (!handlers.find(handler => handler.url == 'action')) {
        handlers.push({
            url: 'action',
            method: 'POST',
            handler: globalActionHandler
        })
    }

    if (!handlers.find(handler => handler.url == 'dispose')) {
        handlers.push({
            url: 'dispose',
            method: 'GET',
            handler: disposeHandler
        })
    }

    if (!handlers.find(handler => handler.url == 'healthcheck')) {
        handlers.push({
            url: 'healthcheck',
            method: 'GET',
            handler: healthCheckHandler
        })
    }
}

const globalHandler = async (httpRequest, httpResponse) => {

    checkDefaultHandlers()

    let response = await createResponseObject(httpRequest.url)
    let request = null
    let info = await getRequestInfo(httpRequest)

    try {
        let handler = handlers.find(_handler => _handler.method == info.method && checkUrlPatterns(_handler.url, info.url).result)
        if (handler) {

            if (handler.parseBody || handler.parseBody == undefined) {
                request = await getRequestObject(httpRequest)
            } else {
                request = info
            }
            let handlerParams = checkUrlPatterns(handler.url, request.url).params
            await handler.handler({
                httpRequest,
                request,
                httpResponse,
                response,
                handlerParams
            })
        } else {
            throw 'Handler not found'
        }

    } catch (error) {
        await errorHandler({
            httpRequest,
            httpResponse,
            error
        })
    }
}

export {
    globalHandler,
    addHandler
}