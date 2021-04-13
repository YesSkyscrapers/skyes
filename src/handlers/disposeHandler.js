import { File } from 'skyes';
import entityManager from 'skyes/src/entityManager';
import fileManager from 'skyes/src/fileManager';
import skyes from 'skyes/src/skyes';
import errorHandler from './errorHandler'


const handler = (request, response) => {
    return async (httpResponse) => {

        try {
            httpResponse.end("disposing")
            skyes.dispose();
            return;
        } catch (_error) {
            const error = `DisposeHandler error: ${_error}`
            await errorHandler(request, response)(error)
            throw error;
        }
    }
}

export default handler;