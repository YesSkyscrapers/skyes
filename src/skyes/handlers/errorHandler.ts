import { IncomingMessage, OutgoingMessage } from 'http'
import { HandlerCustomParams, HandlerHandle, HandlerPathParams } from '../types'

const handler: HandlerHandle = async (
    request: IncomingMessage,
    response: OutgoingMessage,
    pathParams?: HandlerPathParams,
    params?: HandlerCustomParams
) => {
    if (params?.error) {
        response.end(
            JSON.stringify({
                error: params.error
            })
        )
    } else {
        response.end(
            JSON.stringify({
                error: 'Error handler not received error'
            })
        )
    }
}

const getErrorHandler = (request: IncomingMessage, response: OutgoingMessage, errorMessage: string) =>
    handler(request, response, {}, { error: errorMessage })

export { getErrorHandler }
