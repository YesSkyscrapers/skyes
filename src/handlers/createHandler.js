import entityManager from 'skyes/src/entityManager';
import errorHandler from './errorHandler'

const handler = (request, response) => {
    return async entityDefinition => {

        try {
            const entity = request.body.data

            const createResult = await entityManager.create(entityDefinition, entity)

            response.body = {
                count: createResult.count,
                created: createResult.entity
            }
        } catch (error) {
            await errorHandler(request, response)(`CreateHandler error: ${error}`)
        }
    }
}

export default handler;