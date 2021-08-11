import logsManager from "../logsManager"
import { errorHandler } from "./errorHandler"
import { globalActionHandler } from "./globalActionHandler"
import { checkUrlPatterns, createResponseObject, getRequestObject } from "./tools"

let handlers = [{
    url: 'action',
    method: 'POST',
    handler: globalActionHandler
}]

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



export const globalHandler = async (httpRequest, httpResponse) => {


    let response = await createResponseObject()
    let request = null
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
