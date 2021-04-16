import { File } from 'skyes';
import entityManager from 'skyes/src/entityManager';
import fileManager from 'skyes/src/fileManager';
import skyes from 'skyes/src/skyes';
import errorHandler from './errorHandler'


const handler = async (request, response) => {
    try {
        response.body = {
            message: "all ok"
        }
    } catch (_error) {
        const error = `HealthCheckHandler error: ${_error}`
        await errorHandler(request, response)(error)
        throw error;
    }
}

export default handler;