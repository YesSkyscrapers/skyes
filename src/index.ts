import skyes from 'skyes/src/skyes'
import entityManager from './entityManager'
import readHandler from './handlers/readHandler'
import createHandler from './handlers/createHandler'
import deleteHandler from './handlers/deleteHandler'
import updateHandler from './handlers/updateHandler'
import { File } from './entities/model/File';


const handlers = {
    readHandler,
    createHandler,
    deleteHandler,
    updateHandler,
}

const entities = {
    File
}

export {
    skyes,
    entityManager,
    handlers,
    entities
}