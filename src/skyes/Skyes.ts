import http, { Server as HttpServer, IncomingMessage, OutgoingMessage } from 'http'
import { checkUrlPatterns, createResponseObject, getArg, getRequestInfo, getRequestObject } from './tools'
import {
    AddActionParams,
    AddHandlerParams,
    CheckUrlResult,
    Config,
    ErrorHandlerParams,
    GlobalActionHandlerParams,
    RequestObject,
    ResponseObject
} from '../interfaces/interfaces'
import disposeHandler from '../handlers/disposeHandler'
import healthCheckHandler from '../handlers/healthCheckHandler'
import { errorHandler } from '../handlers/errorHandler'
const moment = require('moment')

class Skyes {
    serverConfig: Config
    httpServer: HttpServer
    port: number
    handlers: AddHandlerParams[]
    actions: AddActionParams[]
    errorHandler: (params: ErrorHandlerParams) => Promise<void>
    createResponseObject: (url: string) => Promise<ResponseObject>
    checkUrlPatterns: (handlerUrl: string, requestUrl: string) => CheckUrlResult

    constructor(config: Config) {
        this.serverConfig = config
        this.handlers = this.getDefaultHandlers(config)
        this.actions = []
        this.httpServer = http.createServer(this.serverHandler)
        let cmdPort = getArg('port')
        this.port = cmdPort && Number(cmdPort) !== Number.NaN ? Number(cmdPort) : this.serverConfig.defaultPort
        this.errorHandler = errorHandler(config)
        this.createResponseObject = createResponseObject(config)
        this.checkUrlPatterns = checkUrlPatterns(config)
    }

    getDefaultHandlers = (config: Config) => {
        return [
            {
                url: 'action',
                method: 'POST',
                handler: async (params: GlobalActionHandlerParams) => {
                    const { httpRequest, request, httpResponse, response, handlerParams } = params
                    try {
                        let actionHandler = this.actions.find((_action) => _action.name == request.body.action)
                        if (actionHandler) {
                            await actionHandler.action(params)

                            if (!response.disableProcessing) {
                                response.headers.forEach((header) => {
                                    httpResponse.setHeader(header.key, header.value!)
                                })

                                httpResponse.end(response.body ? JSON.stringify(response.body) : undefined)
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
                        await this.errorHandler(errorParams)
                    }
                }
            },
            {
                url: 'dispose',
                method: 'GET',
                handler: disposeHandler(config, this.stop)
            },
            {
                url: 'healthcheck',
                method: 'GET',
                handler: healthCheckHandler(config)
            }
        ]
    }

    serverHandler = async (httpRequest: IncomingMessage, httpResponse: OutgoingMessage) => {
        const response = await this.createResponseObject(httpRequest.url!)
        let request: RequestObject
        const info = await getRequestInfo(httpRequest)

        try {
            const handler = this.handlers.find((_handler) => {
                return (
                    (!_handler.method || (_handler.method == info.method && !!_handler.method)) &&
                    this.checkUrlPatterns(_handler.url, info.url).result
                )
            })
            if (handler) {
                if (handler.parseBody || handler.parseBody == undefined) {
                    request = await getRequestObject(httpRequest)
                } else {
                    request = info
                }
                const handlerParams = this.checkUrlPatterns(handler.url, request.url).params
                const params: GlobalActionHandlerParams = {
                    httpRequest,
                    request,
                    httpResponse,
                    response,
                    handlerParams
                }
                await handler.handler(params)
            } else {
                throw 'Handler not found'
            }
        } catch (error) {
            const params: ErrorHandlerParams = {
                httpRequest,
                httpResponse,
                error
            }
            await this.errorHandler(params)
        }
    }

    start = async () => {
        try {
            await new Promise((resolve, reject) => {
                this.httpServer.listen(this.port, () => {
                    console.log(`${moment().format('DD.MM HH:mm:ss')}: Skyes started on port: ${this.port}`)
                    resolve(null)
                })
            })
        } catch (error) {
            throw `${moment().format('DD.MM HH:mm:ss')}: Server start failed with error: ${error}`
        }
    }

    stop = async () => {
        try {
            await new Promise((resolve, reject) => {
                this.httpServer.close(() => {
                    console.log(`${moment().format('HH:mm:ss')}: Local server stopped`)
                    resolve(null)
                })
            })
        } catch (error) {
            throw `${moment().format('HH:mm:ss')}: Server stop failed with error: ${error}`
        }
    }

    addAction = (params: AddActionParams) => {
        this.actions.push(params)
    }

    addHandler = (params: AddHandlerParams) => {
        const { url, method, handler, parseBody } = params

        if (url == 'action') {
            throw 'Action handler reserved'
        } else {
            this.handlers.push(params)
        }
    }

    getConfig = () => {
        return this.serverConfig
    }
}

export default Skyes
