import entityManager from 'skyes/src/entityManager';
import errorHandler from './errorHandler'

const handler = (request, response) => {
    return async entityDefinition => {

        try {
            const entities = request.body.data

            const deleteResult = await entityManager.deleteEntities(entityDefinition, entities)

            response.body = {
                count: deleteResult.count
            }
        } catch (error) {
            await errorHandler(request, response)(`DeleteHandler error: ${error}`)
        }
    }
}

export default handler;