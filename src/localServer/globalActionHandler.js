
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
            throw 'Action not found'
        }

    } catch (error) {
        console.log(error)
        await errorHandler({
            httpRequest,
            httpResponse,
            error
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


    httpResponse.end(response.body ? JSON.stringify(response.body) : undefined)
}