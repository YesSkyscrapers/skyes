import { OutgoingMessage, IncomingMessage } from 'http'
import { AuthModuleInstance } from './authModule/types'

type InitSkyesParams = {
    port: number
    host?: string
    customPath?: string
    constHeaders?: {
        [key: string]: string
    }
    authModule?: AuthModuleInstance
}

type Action<T, U> = {
    name: string
    handle: (request: ActionRequest<T>, response: ActionResponse<U>) => Promise<void>
    verifyAuth?: boolean
}

type HttpMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH'

type HandlerPathParams = {
    [key: string]: string
}

type HandlerCustomParams = {
    [key: string]: any
}

type HandlerHandle = (
    request: IncomingMessage,
    response: OutgoingMessage,
    pathParams: HandlerPathParams,
    params?: HandlerCustomParams
) => Promise<void>

type Handler = {
    path: string
    method?: HttpMethod
    handle: HandlerHandle
    verifyAuth?: boolean
}

type AssociatePathPatternResult = {
    isSame: boolean
    params?: HandlerPathParams
}

type ActionRequest<T> = {
    action: string
    data: T
}

type ActionResponse<T> = {
    body?: T
}

export {
    InitSkyesParams,
    Action,
    Handler,
    AssociatePathPatternResult,
    HandlerPathParams,
    HandlerCustomParams,
    HandlerHandle,
    ActionRequest,
    ActionResponse
}
