import { File } from 'skyes';
import entityManager from 'skyes/src/entityManager';
import fileManager from 'skyes/src/fileManager';
import skyes from 'skyes/src/skyes';
import errorHandler from './errorHandler'


const handler = (request, httpResponse) => {
    return async (params) => {

        try {
            httpResponse.end("disposing")
            skyes.dispose();
            return;
        } catch (_error) {
            const error = `DisposeHandler error: ${_error}`
            throw error;
        }
    }
}

export default handler;