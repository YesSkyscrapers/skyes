import logsManager from "../logsManager"
import { errorHandler } from "./errorHandler"
import { createResponseObject, getRequestObject } from "./tools"

let actions = []


export const addAction = ({
    name,
    action,
    disableLogging,
}) => {
    actions.push({
        name,
        action,
        disableLogging
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
        let actionHandler = actions.find(_action => _action.name == request.body.action)
        if (actionHandler) {

            if (!actionHandler.disableLogging) {
                logsManager.logActionRequest(httpRequest, request, response)
            }

            await actionHandler.action({
                httpRequest,
                request,
                httpResponse,
                response,
                handlerParams
            })

            if (!response.disableProcessing) {
                await processResponse({
                    httpRequest,
                    request,
                    httpResponse,
                    response,
                    handlerParams,
                    actionHandler
                })
            }
        } else {
            logsManager.logActionRequest(httpRequest, request, response)
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

export const processResponse = async ({
    httpRequest,
    request,
    httpResponse,
    response,
    handlerParams,
    actionHandler = {}
}) => {


    response.headers.forEach(header => {
        httpResponse.setHeader(header.key, header.value)
    })

    if (!actionHandler.disableLogging) {
        logsManager.logActionResponse(response, request)
    }

    httpResponse.end(response.body ? JSON.stringify(response.body) : undefined)
}