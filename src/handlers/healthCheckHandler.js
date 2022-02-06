


const handler = async ({
    httpRequest,
    request,
    httpResponse,
    response,
    handlerParams
}) => {
    try {
        httpResponse.end("ok")
        return;
    } catch (_error) {
        const error = `HealthCheckHandler error: ${_error}`
        throw error;
    }
}


export default handler;