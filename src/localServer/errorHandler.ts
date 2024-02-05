import { ErrorHandlerParams } from '../interfaces/interfaces'
import server, { Config } from './server'

export const errorHandler = async (params: ErrorHandlerParams) => {
    const { httpRequest, httpResponse, error } = params
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

    httpResponse.end(
        JSON.stringify({
            error: error.message ? error.message : error
        })
    )
}
