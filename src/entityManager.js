import { createConnection, Equal, ILike, In, Like } from "typeorm";
const File = require("./entities/model/File").File

const entityManager = {
    registerEntity: (type) => { },
    init: () => { },
    read: (entity, pageSize, pageIndex) => { },
    create: (entityDefinition, entity) => { },
    update: (entityDefinition, entity) => { },
    deleteEntities: (entityDefinition, entities) => { },
}

let entities = []
let connection = null;

entityManager.registerEntity = (type) => {
    entities.push(type);
}

entityManager.init = async (ormconfig) => {
    entityManager.registerEntity(File);
    const config = {
        ...ormconfig,
        entities: ormconfig.entities.concat(require("./entities/schemas/FileSchema"))
    }
    try {
        connection = await createConnection(config)
    } catch (error) {
        throw `EntityManager not created connection: ${error}`
    }
}

const checkConnection = () => {
    if (!connection) {
        throw 'EntityManager DB connection not established'
    }
}

const findEntityDefinition = (entity) => {
    const entityDefinition = entities.find(entityDefinition => entity instanceof entityDefinition)
    if (entityDefinition) {
        return entityDefinition
    } else {
        throw 'EntityManager not found entity definition'
    }
}

const checkEntityDefinition = entityDefinition => {
    if (!entityDefinition) {
        throw 'Entity definition not exist'
    }
}



const mapFilters = filters => {
    let filtersObject = {}

    if (filters.length == 0) {
        return null;
    }

    filters.forEach(filter => {
        switch (filter.type) {
            case "like": {
                filtersObject = {
                    ...filtersObject,
                    [filter.key]: Like(filter.value)
                }
                break;
            }
            case "in": {
                filtersObject = {
                    ...filtersObject,
                    [filter.key]: In(filter.value)
                }
                break;
            }
            case "equal": {
                filtersObject = {
                    ...filtersObject,
                    [filter.key]: Equal(filter.value)
                }
                break;
            }
        }
    })

    return filtersObject;
}

entityManager.read = async (entityDefinition, pageSize, pageIndex, filters = []) => {
    checkConnection();
    checkEntityDefinition(entityDefinition)


    const repository = connection.getRepository(entityDefinition);
    let result = {
        data: [],
        count: 0
    }

    const whereObject = mapFilters(filters)

    result.data = await repository.find({
        skip: pageIndex * pageSize,
        take: pageSize,
        where: whereObject ? whereObject : undefined
    })

    result.count = await repository.count()

    return result;
}


entityManager.create = async (entityDefinition, entity) => {
    checkConnection();
    checkEntityDefinition(entityDefinition)

    const repository = connection.getRepository(entityDefinition);
    let result = {
        entity: await repository.save(entity),
        count: await repository.count(),
    }

    result.count = await repository.count()

    return result;
}

entityManager.deleteEntities = async (entityDefinition, entities) => {
    checkConnection();
    checkEntityDefinition(entityDefinition)

    const repository = connection.getRepository(entityDefinition);
    let result = {
        count: 0
    }

    await repository.remove(entities)

    result.count = await repository.count()

    return result;
}

entityManager.update = async (entityDefinition, entity) => {
    checkConnection();
    checkEntityDefinition(entityDefinition)

    const repository = connection.getRepository(entityDefinition);
    let result = {
        data: null
    }

    const entityInDb = await repository.findOne(entity.id)
    const newEntity = {
        ...entityInDb,
        ...entity
    }

    await repository.save(newEntity)
    result.data = await repository.findOne(entity.id);

    return result;
}




export default entityManager;