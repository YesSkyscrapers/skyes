import entityManager from 'skyes/src/entityManager';
import errorHandler from './errorHandler'

const handler = (request, response) => {
    return async entityDefinition => {

        const paginationSettings = request.body.data;

        if (typeof (paginationSettings.pageSize) != 'number' || typeof (paginationSettings.pageIndex) != 'number') {
            await errorHandler(request, response)("Pagination settings wrong!")
            return;
        }
        try {

            const readResult = await entityManager.read(entityDefinition, paginationSettings.pageSize, paginationSettings.pageIndex, paginationSettings.filters)

            response.body = {
                data: readResult.data,
                count: readResult.count
            }
        } catch (error) {
            await errorHandler(request, response)(`ReadHandler error: ${error}`)
        }
    }
}

export default handler;