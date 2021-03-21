import skyes from 'skyes/src/skyes'
import entityManager from './entityManager'
import readHandler from './handlers/readHandler'
import createHandler from './handlers/createHandler'
import deleteHandler from './handlers/deleteHandler'
import updateHandler from './handlers/updateHandler'

const handlers = {
    readHandler,
    createHandler,
    deleteHandler,
    updateHandler,
}

export {
    skyes,
    entityManager,
    handlers,
}