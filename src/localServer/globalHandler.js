import logsManager from "../logsManager"
import { errorHandler } from "./errorHandler"
import { globalActionHandler } from "./globalActionHandler"
import { checkUrlPatterns, createResponseObject, getRequestObject } from "./tools"

let handlers = []

export const addHandler = ({
    url,
    method,
    handler
}) => {
    if (url == 'action') {
        throw 'Action handler reserved'
    } else {
        handlers.push({
            url,
            method,
            handler
        })
    }
}

const checkActionHandler = () => {
    if (!handlers.find(handler => handler.url == 'action')) {
        handlers.push({
            url: 'action',
            method: 'POST',
            handler: globalActionHandler
        })
    }
}

export const globalHandler = async (httpRequest, httpResponse) => {

    checkActionHandler()

    let response = await createResponseObject()
    let request = null

    logsManager.logHandlerRequest(httpRequest, response)

    try {
        request = await getRequestObject(httpRequest)
        let handler = handlers.find(_handler => _handler.method == request.method && checkUrlPatterns(_handler.url, request.url).result)
        if (handler) {
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

    } catch (_error) {
        const error = `Error: ${_error}`
        logsManager.error(error)
        await errorHandler({
            httpRequest,
            httpResponse,
            errorMessage: error
        })
    }
}
