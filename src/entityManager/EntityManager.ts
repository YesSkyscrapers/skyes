import { DataSource, DataSourceOptions, EntityTarget, ObjectLiteral, Repository } from 'typeorm'
import {
    CountResult,
    CreateManyResult,
    CreateResult,
    Filters,
    ReadResult,
    UpdateResult
} from '../interfaces/interfaces'
import { mapFilters } from './tools'

interface RepositoryItem<T extends ObjectLiteral> {
    entity: EntityTarget<T>
    repository: Repository<T>
}

interface PaginationSettings {
    pageSize: number
    pageIndex: number
}

class EntityManager {
    source: DataSource
    repositories: RepositoryItem<any>[] = []

    constructor(dataSourceOptions: DataSourceOptions) {
        try {
            this.source = new DataSource(dataSourceOptions)
        } catch (error) {
            throw `EntityManager not connect to source: ${error}`
        }
    }

    init = async () => {
        if (!this.source.isInitialized) {
            await this.source.initialize()
        }
    }

    dispose = async () => {
        try {
            await this.source.destroy()
            console.log('EntityManager source destroyed.')
        } catch (error) {
            throw `EntityManager source destroy failed: ${error}`
        }
    }

    getRepository = async <T extends ObjectLiteral>(entityClass: EntityTarget<T>) => {
        let exists = this.repositories.find((item) => item.entity === entityClass)
        if (exists) {
            return exists.repository
        } else {
            const repository = await this.source.getRepository(entityClass)
            this.repositories.push({
                entity: entityClass,
                repository: repository
            })

            return repository
        }
    }

    read = async <T extends ObjectLiteral>(
        entityClass: EntityTarget<T>,
        pagination: PaginationSettings,
        filters: Filters | undefined = []
    ) => {
        if (!pagination) {
            throw 'PaginationSettings is empty'
        }

        const repository = await this.getRepository(entityClass)
        let result: ReadResult<T> = {
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

        return result
    }

    count = async <T extends ObjectLiteral>(entityClass: EntityTarget<T>, filters: Filters | undefined = []) => {
        const repository = await this.getRepository(entityClass)

        const { whereObject, orderObject } = mapFilters(filters)

        let result: CountResult = {
            count: -1
        }

        result.count = await repository.count({
            where: whereObject ? whereObject : undefined,
            order: orderObject ? orderObject : undefined
        })

        return result
    }

    create = async <T extends ObjectLiteral>(entityClass: EntityTarget<T>, entity: T) => {
        const repository = await this.getRepository(entityClass)
        let result: CreateResult<T> = {
            entity: await repository.save(entity),
            count: await repository.count()
        }

        return result
    }

    createEntities = async <T extends ObjectLiteral>(entityClass: EntityTarget<T>, entities: Array<T>) => {
        const repository = await this.getRepository(entityClass)
        let result: CreateManyResult<T> = {
            entities: await repository.save(entities),
            count: await repository.count()
        }

        return result
    }

    deleteEntities = async <T extends ObjectLiteral>(entityClass: EntityTarget<T>, entities: Array<T> = []) => {
        const repository = await this.getRepository(entityClass)

        let result: CountResult = {
            count: -1
        }

        await repository.delete(entities as any)

        result.count = await repository.count()

        return result
    }

    updateEntity = async <T extends ObjectLiteral>(entityClass: EntityTarget<T>, entity: any) => {
        const repository = await this.getRepository(entityClass)

        const entityInDb = await repository.findOne({ where: { id: entity.id } })

        const newEntity = {
            ...entityInDb,
            ...entity
        }

        await repository.save(newEntity)

        let result: UpdateResult<T> = {
            data: (await repository.findOne({ where: { id: entity.id } })) as T
        }
        return result
    }
}

export default EntityManager
