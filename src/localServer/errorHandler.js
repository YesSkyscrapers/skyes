import server from "./server"

export const errorHandler = async ({
    httpRequest,
    httpResponse,
    error
}) => {
    const config = server.getConfig()

    let headers = []
    headers.push({
        key: 'Content-Type',
        value: 'application/json'
    })
    if (config.defaultHeaders) {
        Object.keys(config.defaultHeaders).forEach(key => {
            headers.push({
                key: key,
                value: config.defaultHeaders[key]
            })
        })
    }

    headers.forEach(header => {
        httpResponse.setHeader(header.key, header.value);
    })

    httpResponse.end(JSON.stringify({
        error: error.message ? error.message : error
    }))
}