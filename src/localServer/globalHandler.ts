import { errorHandler } from './errorHandler'
import { globalActionHandler } from './globalActionHandler'
import disposeHandler from '../handlers/disposeHandler'
import healthCheckHandler from '../handlers/healthCheckHandler'
import { checkUrlPatterns, createResponseObject, getRequestInfo, getRequestObject } from './tools'
import {
    AddHandlerParams,
    ErrorHandlerParams,
    GlobalActionHandlerParams,
    RequestObject
} from '../interfaces/interfaces'
import { IncomingMessage, OutgoingMessage } from 'http'

let handlers: Array<AddHandlerParams> = []

const addHandler = (params: AddHandlerParams) => {
    const { url, method, handler, parseBody } = params

    if (url == 'action') {
        throw 'Action handler reserved'
    } else {
        handlers.push(params)
    }
}

const checkDefaultHandlers = () => {
    if (!handlers.find((handler) => handler.url == 'action')) {
        const params: AddHandlerParams = {
            url: 'action',
            method: 'POST',
            handler: globalActionHandler
        }
        handlers.push(params)
    }

    if (!handlers.find((handler) => handler.url == 'dispose')) {
        const params: AddHandlerParams = {
            url: 'dispose',
            method: 'GET',
            handler: disposeHandler
        }
        handlers.push(params)
    }

    if (!handlers.find((handler) => handler.url == 'healthcheck')) {
        const params: AddHandlerParams = {
            url: 'healthcheck',
            method: 'GET',
            handler: healthCheckHandler
        }
        handlers.push(params)
    }
}

const globalHandler = async (httpRequest: IncomingMessage, httpResponse: OutgoingMessage) => {
    checkDefaultHandlers()

    const response = await createResponseObject(httpRequest.url!)
    let request: RequestObject
    const info = await getRequestInfo(httpRequest)

    try {
        const handler = handlers.find((_handler) => {
            return (
                (!_handler.method || (_handler.method == info.method && !!_handler.method)) &&
                checkUrlPatterns(_handler.url, info.url).result
            )
        })
        if (handler) {
            if (handler.parseBody || handler.parseBody == undefined) {
                request = await getRequestObject(httpRequest)
            } else {
                request = info
            }
            const handlerParams = checkUrlPatterns(handler.url, request.url).params
            const params: GlobalActionHandlerParams = {
                httpRequest,
                request,
                httpResponse,
                response,
                handlerParams
            }
            await handler.handler(params)
        } else {
            throw 'Handler not found'
        }
    } catch (error) {
        const params: ErrorHandlerParams = {
            httpRequest,
            httpResponse,
            error
        }
        await errorHandler(params)
    }
}

export { globalHandler, addHandler }
