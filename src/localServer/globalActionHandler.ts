import { AddActionParams, ErrorHandlerParams, GlobalActionHandlerParams } from '../interfaces/interfaces'
import { errorHandler } from './errorHandler'

let actions: Array<AddActionParams> = []

export const addAction = (params: AddActionParams) => {
    actions.push(params)
}

export const globalActionHandler = async (params: GlobalActionHandlerParams) => {
    const { httpRequest, request, httpResponse, response, handlerParams } = params
    try {
        let actionHandler = actions.find((_action) => _action.name == request.body.action)
        if (actionHandler) {
            await actionHandler.action(params)

            if (!response.disableProcessing) {
                await processResponse(params)
            }
        } else {
            throw 'Action not found'
        }
    } catch (error) {
        const errorParams: ErrorHandlerParams = {
            httpRequest,
            httpResponse,
            error
        }
        await errorHandler(errorParams)
    }
}

export const processResponse = async (params: GlobalActionHandlerParams) => {
    const { httpRequest, request, httpResponse, response, handlerParams } = params

    response.headers.forEach((header) => {
        httpResponse.setHeader(header.key, header.value!)
    })

    httpResponse.end(response.body ? JSON.stringify(response.body) : undefined)
}
