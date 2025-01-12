import { Config, HandlerParams } from '../interfaces/interfaces'

const handler = (config: Config) => async (params: HandlerParams) => {
    const { httpRequest, request, httpResponse, response, handlerParams } = params
    try {
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

        httpResponse.end('ok')
        return
    } catch (_error) {
        const error = `HealthCheckHandler error: ${_error}`
        throw error
    }
}

export default handler
