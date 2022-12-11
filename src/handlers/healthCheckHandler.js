
import server from "../localServer/server"

const handler = async ({
    httpRequest,
    request,
    httpResponse,
    response,
    handlerParams
}) => {
    try {
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

        
        httpResponse.end("ok")
        return;
    } catch (_error) {
        const error = `HealthCheckHandler error: ${_error}`
        throw error;
    }
}


export default handler;