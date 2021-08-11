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
        const error = `Error: ${_error}`
        logsManager.error(error)
        await errorHandler({
            httpRequest,
            httpResponse,
            errorMessage: error
        })
    }
}

export const processResponse = (httpResponse, responseObject) => {
    // Object.keys(serverStartConfig.defaultHeaders).forEach(key => {
    //     httpResponse.setHeader(key, serverStartConfig.defaultHeaders[key])
    // })
    responseObject.headers.forEach(header => {
        httpResponse.setHeader(header.key, header.value)
    })

    httpResponse.end(responseObject.body ? JSON.stringify(responseObject.body) : undefined)
}