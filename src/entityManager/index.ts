import { Connection, ConnectionOptions, EntityTarget, ObjectLiteral, createConnection } from 'typeorm'
import { mapFilters } from './tools'
import {
    CountResult,
    CreateManyResult,
    CreateResult,
    Filters,
    PaginationSettings,
    ReadResult,
    UpdateResult
} from '../interfaces/interfaces'

const DEFAULT_PAGINATION: PaginationSettings = {
    pageSize: 10,
    pageIndex: 0
}

const DEFAULT_FILTERS: Filters = []

class EntityManager {
    connection: Connection | null

    constructor() {
        this.connection = null
    }

    checkConnection = () => {
        if (!this.connection) {
            throw 'EntityManager DB connection not established'
        }
    }

    init = async (ormConfig: ConnectionOptions) => {
        try {
            this.connection = await createConnection(ormConfig)
        } catch (error) {
            throw `EntityManager not created connection: ${error}`
        }
    }

    dispose = async () => {
        try {
            await this.connection?.close()
            console.log('EntityManager connection disposed.')
        } catch (error) {
            throw `EntityManager connection dispose failed: ${error}`
        }
    }

    read = async <T extends ObjectLiteral>(
        entityClass: EntityTarget<T>,
        pagination: PaginationSettings = DEFAULT_PAGINATION,
        filters: Filters = DEFAULT_FILTERS
    ) => {
        this.checkConnection()

        const repository = this.connection?.getRepository(entityClass)
        let result: ReadResult<T> = {
            data: [],
            count: -1
        }

        const { whereObject, orderObject } = mapFilters(filters)
        result.data = await repository!.find({
            skip: pagination.pageIndex * pagination.pageSize,
            take: pagination.pageSize,
            where: whereObject ? whereObject : undefined,
            order: orderObject ? orderObject : undefined
        })

        result.count = await repository!.count({
            skip: pagination.pageIndex * pagination.pageSize,
            take: pagination.pageSize,
            where: whereObject ? whereObject : undefined,
            order: orderObject ? orderObject : undefined
        })

        return result
    }

    count = async <T extends ObjectLiteral>(entityClass: EntityTarget<T>, filters: Filters = DEFAULT_FILTERS) => {
        this.checkConnection()

        const repository = this.connection?.getRepository(entityClass)

        const { whereObject, orderObject } = mapFilters(filters)

        let result: CountResult = {
            count: -1
        }

        result.count = await repository!.count({
            where: whereObject ? whereObject : undefined,
            order: orderObject ? orderObject : undefined
        })

        return result
    }

    create = async <T extends ObjectLiteral>(entityClass: EntityTarget<T>, entity: any) => {
        this.checkConnection()

        const repository = this.connection?.getRepository(entityClass)
        let result: CreateResult<T> = {
            entity: await repository!.save(entity),
            count: await repository!.count()
        }

        return result
    }

    createEntities = async <T extends ObjectLiteral>(entityClass: EntityTarget<T>, entities: Array<any>) => {
        this.checkConnection()

        const repository = this.connection?.getRepository(entityClass)
        let result: CreateManyResult<T> = {
            entities: await repository!.save(entities),
            count: await repository!.count()
        }

        return result
    }

    deleteEntities = async <T extends ObjectLiteral>(entityClass: EntityTarget<T>, entities: Array<T> = []) => {
        this.checkConnection()

        const repository = this.connection?.getRepository(entityClass)

        let result: CountResult = {
            count: -1
        }

        await repository!.delete(entities as any)

        result.count = await repository!.count()

        return result
    }

    updateEntity = async <T extends ObjectLiteral>(entityClass: EntityTarget<T>, entity: any) => {
        this.checkConnection()

        const repository = this.connection?.getRepository(entityClass)

        const entityInDb = await repository!.findOne(entity.id)
        const newEntity = {
            ...entityInDb,
            ...entity
        }

        await repository!.save(newEntity)

        let result: UpdateResult<T> = {
            data: (await repository!.findOne(entity.id)) as T
        }

        return result
    }

    getRepository = async <T extends ObjectLiteral>(entityClass: EntityTarget<T>) => {
        this.checkConnection()

        const repository = await this.connection?.getRepository(entityClass)

        return repository
    }
}

const entityManager = new EntityManager()

export default entityManager
