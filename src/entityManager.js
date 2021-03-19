import { createConnection } from "typeorm";

const entityManager = {
    registerEntity: (type) => { },
    init: () => { },
    saveEntity: (entity) => { }
}

let entities = []
let connection = null;

entityManager.registerEntity = (type) => {
    entities.push(type);
}

entityManager.init = async () => {
    try {
        connection = await createConnection()
    } catch (error) {
        throw `EntityManager not created connection: ${error}`
    }
}

entityManager.saveEntity = async (entity) => {
    if (!connection) {
        throw 'EntityManager DB connection not established'
    }
    const entityDefinition = entities.find(entityDefinition => entity instanceof entityDefinition)
    if (entityDefinition) {
        const repository = connection.getRepository(entityDefinition);
        await repository.save(entity)
    } else {
        throw 'EntityManager not found entity definition'
    }
}

entityManager.get = () => {

}


export default entityManager;