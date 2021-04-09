import { File } from 'skyes';
import entityManager from 'skyes/src/entityManager';
import fileManager from 'skyes/src/fileManager';
import errorHandler from './errorHandler'

const makeError = (request, response) => async error => {
    await errorHandler(request, response)(error)
    throw error
}

const handler = (request, response) => {
    return async (httpResponse) => {

        const fileId = request.urlParts[1];


        if (!fileId) {
            await makeError(request, response)("FileId wrong!")
        }

        try {
            return await fileManager.writeFileToResponse(httpResponse, fileId);
        } catch (_error) {
            await makeError(request, response)(`FileReadHandler error: ${_error}`)
        }
    }
}

export default handler;