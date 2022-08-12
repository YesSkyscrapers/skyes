import { createConnection } from "typeorm";
import { mapFilters } from "./tools";

const DEFAULT_PAGINATION = {
    pageSize: 10,
    pageIndex: 0
}

const DEFAULT_FILTERS = []

class EntityManager {
    constructor() {
        this.connection = null;
    }

    checkConnection = (

    ) => {
        if (!this.connection) {
            throw 'EntityManager DB connection not established'
        }
    }

    init = async (
        ormConfig
    ) => {
        try {
            this.connection = await createConnection(ormConfig)
        } catch (error) {
            throw `EntityManager not created connection: ${error}`
        }
    }

    dispose = async (

    ) => {
        try {
            await this.connection.close();
            console.log('EntityManager connection disposed.')
        } catch (error) {
            throw `EntityManager connection dispose failed: ${error}`
        }
    }

    read = async (
        entityClass,
        pagination = DEFAULT_PAGINATION,
        filters = DEFAULT_FILTERS
    ) => {
        this.checkConnection();


        const repository = this.connection.getRepository(entityClass);
        let result = {
            data: [],
            count: -1
        }

        const { whereObject, orderObject } = mapFilters(filters)
        result.data = await repository.find({
            skip: pagination.pageIndex * pagination.pageSize,
            take: pagination.pageSize,
            where: whereObject ? whereObject : undefined,
            order: orderObject ? orderObject : undefined
        })

        result.count = await repository.count({
            skip: pagination.pageIndex * pagination.pageSize,
            take: pagination.pageSize,
            where: whereObject ? whereObject : undefined,
            order: orderObject ? orderObject : undefined
        })

        return result;
    }

    count = async (
        entityClass,
        filters = DEFAULT_FILTERS
    ) => {
        this.checkConnection();

        const repository = this.connection.getRepository(entityClass);

        const { whereObject, orderObject } = mapFilters(filters)

        let result = {
            count: -1
        }

        result.count = await repository.count({
            where: whereObject ? whereObject : undefined,
            order: orderObject ? orderObject : undefined
        })

        return result;
    }

    create = async (
        entityClass,
        entity
    ) => {
        this.checkConnection();

        const repository = this.connection.getRepository(entityClass);
        let result = {
            entity: null,
            count: -1
        }

        result.entity = await repository.save(entity)
        result.count = await repository.count()

        return result;
    }

    createEntities = async (
        entityClass,
        entities
    ) => {
        this.checkConnection();

        const repository = this.connection.getRepository(entityClass);
        let result = {
            entities: null,
            count: -1
        }

        result.entities = await repository.save(entities)
        result.count = await repository.count()

        return result;
    }

    deleteEntities = async (
        entityClass,
        entities = []
    ) => {
        this.checkConnection();

        const repository = this.connection.getRepository(entityClass);

        let result = {
            count: -1
        }

        await repository.remove(entities)

        result.count = await repository.count()

        return result;
    }

    updateEntity = async (
        entityClass,
        entity
    ) => {
        this.checkConnection();

        const repository = this.connection.getRepository(entityClass);
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

    getRepository = async (
        entityClass
    ) => {
        this.checkConnection();

        const repository = await this.connection.getRepository(entityClass);

        return repository;
    }
}

let entityManager = new EntityManager()

export default entityManager;