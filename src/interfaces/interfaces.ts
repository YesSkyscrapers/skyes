import { IncomingMessage, OutgoingMessage } from 'http'
import { Config } from '../localServer/server'
import { ConnectionOptions } from 'typeorm'

interface MapResult {
    whereObject: any
    orderObject: any
}

interface PaginationSettings {
    pageSize: number
    pageIndex: number
}

interface Filter {
    type: string
    key: string
    value: any
}

interface Filters extends Array<Filter> {}

interface ReadResult<T> {
    data: Array<T>
    count: number
}

interface CountResult {
    count: number
}

interface CreateResult<T> {
    entity: T
    count: number
}

interface CreateManyResult<T> {
    entities: Array<T>
    count: number
}

interface DeleteResult {
    count: number
}

interface UpdateResult<T> {
    data: T
}

interface HandlerParams {
    httpRequest: IncomingMessage
    request: RequestObject
    httpResponse: OutgoingMessage
    response: ResponseObject
    handlerParams: any
}

interface ErrorHandlerParams {
    httpRequest: IncomingMessage
    httpResponse: OutgoingMessage
    error: any
}

interface GlobalActionHandlerParams {
    httpRequest: IncomingMessage
    request: RequestObject
    httpResponse: OutgoingMessage
    response: ResponseObject
    handlerParams: any
}

interface AddActionParams {
    name: string
    action: (params: GlobalActionHandlerParams) => Promise<void>
}

interface ProcessResponseParams {
    httpRequest: IncomingMessage
    request: RequestObject
    httpResponse: OutgoingMessage
    response: ResponseObject
    handlerParams: any
}

interface AddHandlerParams {
    url: string
    method: string
    handler: (params: GlobalActionHandlerParams) => Promise<void>
    parseBody?: boolean | undefined | null
}

interface Header {
    key: string
    value: string | string[] | undefined
}

interface RequestObject {
    url: string
    paramsObject: any
    method: string
    body: any
    headers: Array<Header>
}

interface ResponseObject {
    url: string
    body: any
    headers: Array<Header>
    disableProcessing: boolean
    requestId: number
}

interface CheckUrlResult {
    result: boolean
    params: any
}

type TypeOfSplittedParsedObject = {
    [key: string]: string
}

type GlobalConfig = {
    ormconfig?: ConnectionOptions
    serverConfig?: Config
}

export {
    MapResult,
    PaginationSettings,
    Filter,
    Filters,
    ReadResult,
    CountResult,
    CreateResult,
    CreateManyResult,
    DeleteResult,
    UpdateResult,
    HandlerParams,
    ErrorHandlerParams,
    AddActionParams,
    GlobalActionHandlerParams,
    ProcessResponseParams,
    AddHandlerParams,
    Header,
    RequestObject,
    ResponseObject,
    CheckUrlResult,
    TypeOfSplittedParsedObject,
    GlobalConfig
}
