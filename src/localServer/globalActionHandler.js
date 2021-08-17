import logsManager from "../logsManager"
import { errorHandler } from "./errorHandler"
import { createResponseObject, getRequestObject } from "./tools"

let actions = []


export const addAction = ({
    name,
    action,
}) => {
    actions.push({
        name,
        action
    })
}

export const globalActionHandler = async ({
    httpRequest,
    request,
    httpResponse,
    response,
    handlerParams
}) => {

    try {

        logsManager.logActionRequest(httpRequest, request, response)

        let actionHandler = actions.find(_action => _action.name == request.body.action)
        if (actionHandler) {
            await actionHandler.action({
                httpRequest,
                request,
                httpResponse,
                response,
                handlerParams
            })

            if (!response.disableProcessing) {
                await processResponse(httpResponse, response)
            }
        } else {
            throw 'Action not found'
        }

    } catch (_error) {
        const error = `Error: ${typeof (_error) == 'object' ? JSON.stringify(_error) : _error}`
        logsManager.error(error)
        await errorHandler({
            httpRequest,
            httpResponse,
            errorMessage: error
        })
    }
}

export const processResponse = (httpResponse, responseObject) => {
    responseObject.headers.forEach(header => {
        httpResponse.setHeader(header.key, header.value)
    })


    logsManager.logActionResponse(responseObject)

    httpResponse.end(responseObject.body ? JSON.stringify(responseObject.body) : undefined)
}