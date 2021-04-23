import entityManager from 'skyes/src/entityManager';
import errorHandler from './errorHandler'

const handler = (request, response) => {
    return async entityDefinition => {

        try {
            const entity = request.body.data

            const createResult = await entityManager.update(entityDefinition, entity)

            response.body = {
                data: createResult.data
            }
        } catch (error) {
            await errorHandler(request, response)(`UpdateHandler error: ${error}`)
        }
    }
}

export default handler;