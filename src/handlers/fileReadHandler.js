import { File } from 'skyes';
import entityManager from 'skyes/src/entityManager';
import fileManager from 'skyes/src/fileManager';
import errorHandler from './errorHandler'

const makeError = async error => {
    throw error
}

const handler = (request, httpResponse) => {
    return async (params) => {


        const fileId = params.fileId;

        if (!fileId) {
            await makeError("FileId wrong!")
        }

        try {
            return await fileManager.writeFileToResponse(httpResponse, fileId);
        } catch (_error) {
            await makeError(`FileReadHandler error: ${_error}`)
        }
    }
}

export default handler;