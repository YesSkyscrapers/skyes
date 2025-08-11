import http, { Server, IncomingMessage, OutgoingMessage } from 'http'
import { Action, AssociatePathPatternResult, Handler, InitSkyesParams } from './types'
import moment from 'moment'
import { associatePathPattern, fillResponseWithBasicHeaders, subtractCustomPath } from './tools'
import { getErrorHandler } from './handlers/errorHandler'
import healthcheckHandler from './handlers/healthcheckHandler'
import { getActionHandler } from './handlers/actionHandler'
import DisabledAuthModule from './authModule/DisabledAuthModule'
import { AuthModuleInstance } from './authModule/types'

const Skyes = (initParams: InitSkyesParams) => {
    const actions: Action<any, any>[] = []

    const authModule: AuthModuleInstance = initParams.authModule ? initParams.authModule : DisabledAuthModule()

    const getActions = () => actions

    const handlers: Handler[] = [
        {
            path: 'healthcheck',
            method: 'GET',
            handle: healthcheckHandler
        },
        {
            path: 'action',
            method: 'POST',
            handle: getActionHandler(getActions, authModule)
        }
    ]

    const handleRequest = async (request: IncomingMessage, response: OutgoingMessage) => {
        try {
            fillResponseWithBasicHeaders(response, initParams.constHeaders)

            const requestUrl = subtractCustomPath(request.url!, initParams.customPath)
            const handlersWithSameMethod = handlers.filter((item) => !item.method || item.method === request.method)

            let selectedHandler: Handler | null = null
            let selectedHandlerAssociateInfo: AssociatePathPatternResult | null = null

            for (const handler of handlersWithSameMethod) {
                const associateInfo = associatePathPattern({ url: requestUrl, pattern: handler.path })
                if (associateInfo.isSame) {
                    selectedHandler = handler
                    selectedHandlerAssociateInfo = associateInfo
                    break
                }
            }

            if (!selectedHandler) {
                const simpleHandlers = handlers.filter((item) => !!item.simpleStartOf)
                for (const handler of simpleHandlers) {
                    if (requestUrl.startsWith(handler.simpleStartOf!)) {
                        selectedHandler = handler
                        selectedHandlerAssociateInfo = { isSame: true, params: {} }
                        break
                    }
                }
            }

            if (selectedHandler) {
                if (selectedHandler.verifyAuth) {
                    await authModule.check(request)
                }

                await selectedHandler.handle(request, response, selectedHandlerAssociateInfo!.params!)
            } else {
                throw 'Handler not found'
            }
        } catch (err: any) {
            await getErrorHandler(request, response, err?.message ? err.message : err)
        }
    }

    const httpServer: Server = http.createServer(handleRequest)

    const start = () => {
        return new Promise((resolve, reject) => {
            try {
                httpServer.listen(initParams.port, initParams?.host || '0.0.0.0', () => {
                    console.log(`${moment().format('DD.MM HH:mm:ss')}: Skyes started on port: ${initParams.port}`)
                    resolve(null)
                })
            } catch (err) {
                reject(err)
            }
        })
    }

    const stop = () => {
        return new Promise((resolve, reject) => {
            try {
                httpServer.close((err?: Error) => {
                    if (err) {
                        reject(err)
                    } else {
                        console.log(`${moment().format('DD.MM HH:mm:ss')}: Skyes stopped`)
                        resolve(null)
                    }
                })
            } catch (err) {
                reject(err)
            }
        })
    }

    const addAction = <T, U>({ name, handle, verifyAuth }: Action<T, U>) => {
        actions.push({
            name,
            handle,
            verifyAuth
        })
    }

    const addHandler = ({ path, method, handle, verifyAuth, simpleStartOf }: Handler) => {
        if (path == 'action') {
            throw 'Action handler reserved'
        } else {
            handlers.push({
                path,
                method,
                handle,
                verifyAuth,
                simpleStartOf
            })
        }
    }

    return {
        start,
        stop,
        addAction,
        addHandler
    }
}

export default Skyes
