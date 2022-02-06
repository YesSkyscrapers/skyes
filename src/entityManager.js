import { createConnection, Equal, MoreThan, MoreThanOrEqual, ILike, In, IsNull, Like, Not } from "typeorm";


const entityManager = {
    registerEntity: (type) => { },
    init: () => { },
    read: (entity, pageSize, pageIndex) => { },
    create: (entityDefinition, entity) => { },
    update: (entityDefinition, entity) => { },
    deleteEntities: (entityDefinition, entities) => { },
    count: (entity) => { },
    dispose: () => { }
}

let entities = []
let connection = null;

entityManager.registerEntity = (type) => {
    entities.push(type);
}

entityManager.init = async (ormconfig) => {
    try {
        connection = await createConnection(ormconfig)
    } catch (error) {
        throw `EntityManager not created connection: ${error}`
    }
}

entityManager.dispose = async () => {
    try {
        await connection.close();
        console.log('EntityManager connection disposed.')
    } catch (error) {
        throw `EntityManager connection dispose failed: ${error}`
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
    let orderObject = {}

    if (filters.length == 0) {
        return [undefined, undefined];
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
            case "morethan": {
                filtersObject = {
                    ...filtersObject,
                    [filter.key]: MoreThan(filter.value)
                }
                break;
            }
            case "morethanorqueal": {
                filtersObject = {
                    ...filtersObject,
                    [filter.key]: MoreThanOrEqual(filter.value)
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
            case "notnull": {
                filtersObject = {
                    ...filtersObject,
                    [filter.key]: Not(IsNull())
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
            case "notequal": {
                filtersObject = {
                    ...filtersObject,
                    [filter.key]: Not(Equal(filter.value))
                }
                break;
            }
            case "order": {
                orderObject = {
                    ...orderObject,
                    [filter.key]: filter.value
                }
            }
        }
    })

    return [filtersObject, orderObject];
}

entityManager.read = async (entityDefinition, pageSize, pageIndex, filters = [], order = "ASC") => {
    checkConnection();
    checkEntityDefinition(entityDefinition)


    const repository = connection.getRepository(entityDefinition);
    let result = {
        data: [],
        count: 0
    }

    const [whereObject, orderObject] = mapFilters(filters)

    result.data = await repository.find({
        skip: pageIndex * pageSize,
        take: pageSize,
        where: whereObject ? whereObject : undefined,
        order: orderObject ? orderObject : undefined
    })


    result.count = await repository.count()

    return result;
}

entityManager.count = async (entityDefinition, filters = []) => {
    checkConnection();
    checkEntityDefinition(entityDefinition)


    const repository = connection.getRepository(entityDefinition);

    const [whereObject, orderObject] = mapFilters(filters)

    let result = {
        count: -1
    }

    result.count = await repository.count({
        where: whereObject ? whereObject : undefined,
        order: orderObject ? orderObject : undefined
    })

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

entityManager.getRepository = async (entityDefinition) => {
    checkConnection();
    checkEntityDefinition(entityDefinition)

    const repository = await connection.getRepository(entityDefinition);

    return repository;
}




export default entityManager;