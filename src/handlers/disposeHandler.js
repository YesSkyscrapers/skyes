
import skyes from 'skyes/src/skyes';


const handler = async ({
    httpRequest,
    request,
    httpResponse,
    response,
    handlerParams
}) => {
    try {
        httpResponse.end("disposing")
        skyes.dispose();
        return;
    } catch (_error) {
        const error = `DisposeHandler error: ${_error}`
        throw error;
    }
}


export default handler;