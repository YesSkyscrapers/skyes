import { IncomingMessage, OutgoingMessage } from 'http'
import { Action, ActionRequest, ActionResponse, HandlerCustomParams, HandlerHandle, HandlerPathParams } from '../types'
import HandlerTools from '../HandlerTools'
import { AuthModuleInstance } from '../authModule/types'

const handler: HandlerHandle = async (
    request: IncomingMessage,
    response: OutgoingMessage,
    pathParams?: HandlerPathParams,
    params?: HandlerCustomParams
) => {
    const actions: Action<any, any>[] = params!.getActions()
    const authModule: AuthModuleInstance = params!.authModule

    const actionRequest: ActionRequest<any> = await HandlerTools.getJsonBody(request)

    const selectedAction = actions.find((action) => action.name === actionRequest.action)

    if (selectedAction) {
        if (selectedAction.verifyAuth) {
            await authModule.check(request)
        }

        let actionResponse: ActionResponse<any> = {}
        await selectedAction.handle(actionRequest, actionResponse)

        response.end(actionResponse.body ? JSON.stringify(actionResponse.body) : undefined)
    } else {
        throw 'Action not found'
    }
}

const getActionHandler =
    (getActions: () => Action<any, any>[], authModule: AuthModuleInstance) =>
    (request: IncomingMessage, response: OutgoingMessage) =>
        handler(request, response, {}, { getActions: getActions, authModule: authModule })

export { getActionHandler }
