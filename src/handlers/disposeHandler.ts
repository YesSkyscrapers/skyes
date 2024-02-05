import skyes from '../skyes'
import server, { Config } from '../localServer/server'
import { HandlerParams } from '../interfaces/interfaces'

const handler = async (params: HandlerParams) => {
    const { httpRequest, request, httpResponse, response, handlerParams } = params
    try {
        const config: Config = server.getConfig()

        let headers = []
        headers.push({
            key: 'Content-Type',
            value: 'application/json'
        })
        if (config.defaultHeaders) {
            Object.keys(config.defaultHeaders).forEach((key) => {
                headers.push({
                    key: key,
                    value: config.defaultHeaders[key]
                })
            })
        }

        headers.forEach((header) => {
            httpResponse.setHeader(header.key, header.value)
        })

        httpResponse.end('disposing')
        skyes.dispose()
        return
    } catch (_error) {
        const error = `DisposeHandler error: ${_error}`
        throw error
    }
}

export default handler
