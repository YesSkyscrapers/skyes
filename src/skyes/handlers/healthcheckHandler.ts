import { IncomingMessage, OutgoingMessage } from 'http'
import { HandlerHandle } from '../types'

const healthcheckHandler: HandlerHandle = async (request: IncomingMessage, response: OutgoingMessage) => {
    response.setHeader('Content-Type', 'text/plain')
    response.end('ok')
}

export default healthcheckHandler
