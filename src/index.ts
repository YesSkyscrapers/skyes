import skyes from 'skyes/src/skyes'
import entityManager from './entityManager'
import fileManager from './fileManager'
import readHandler from './handlers/readHandler'
import createHandler from './handlers/createHandler'
import deleteHandler from './handlers/deleteHandler'
import updateHandler from './handlers/updateHandler'
import errorHandler from './handlers/errorHandler'
import { File } from './entities/model/File';


const handlers = {
    readHandler,
    createHandler,
    deleteHandler,
    updateHandler,
    errorHandler,
}



export {
    skyes,
    entityManager,
    fileManager,
    handlers,
    File
}