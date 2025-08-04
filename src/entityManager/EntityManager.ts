import { DataSource, DataSourceOptions, EntityTarget, ObjectId, ObjectLiteral, Repository } from 'typeorm'
import {
    CountResult,
    CreateResult,
    Filter,
    PaginationSettings,
    ReadResult,
    RepositoryItem,
    UpdateResult
} from './types'
import { mapFilters } from './tools'

const EntityManager = (dataSourceOptions: DataSourceOptions | any) => {
    let source: DataSource | null = null
    let repositories: RepositoryItem<any>[] = []

    const init = async () => {
        try {
            source = new DataSource(dataSourceOptions)

            if (!source.isInitialized) {
                await source.initialize()
            }
        } catch (error) {
            throw `EntityManager can't connect to source: ${error}`
        }
    }

    const dispose = async () => {
        try {
            if (source) {
                await source.destroy()
                console.log('EntityManager source destroyed.')
            }
        } catch (error) {
            throw `EntityManager source destroy failed: ${error}`
        }
    }

    const getRepository = async <T extends ObjectLiteral>(entityClass: EntityTarget<T>) => {
        if (!source) {
            throw 'Source not initialized'
        }

        let exists = repositories.find((item) => item.entity === entityClass)
        if (exists) {
            return exists.repository as Repository<T>
        } else {
            if (source) {
                const repository = await source.getRepository(entityClass)
                repositories.push({
                    entity: entityClass,
                    repository: repository
                })

                return repository
            } else {
                throw 'EntityManager source not inited'
            }
        }
    }

    const read = async <T extends ObjectLiteral>(
        entityClass: EntityTarget<T>,
        pagination: PaginationSettings,
        filters: Filter[] = []
    ) => {
        const repository = await getRepository<T>(entityClass)
        let result: ReadResult<T> = {
            data: [],
            count: 0
        }

        const { whereObject, orderObject } = mapFilters<T>(filters)
        result.data = await repository.find({
            skip: pagination.pageIndex * pagination.pageSize,
            take: pagination.pageSize,
            where: whereObject ? whereObject : undefined,
            order: orderObject ? orderObject : undefined
        })

        result.count = await repository.count({
            where: whereObject ? whereObject : undefined,
            order: orderObject ? orderObject : undefined
        })

        return result
    }

    const count = async <T extends ObjectLiteral>(entityClass: EntityTarget<T>, filters: Filter[] = []) => {
        const repository = await getRepository<T>(entityClass)

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

    const create = async <T extends ObjectLiteral>(entityClass: EntityTarget<T>, entities: T[] | T) => {
        const repository = await getRepository<T>(entityClass)
        let result: CreateResult<T> = {
            entities: Array.isArray(entities)
                ? await repository.save<T>(entities)
                : [await repository.save<T>(entities)],
            count: await repository.count()
        }

        return result
    }

    const remove = async <T extends ObjectLiteral>(entityClass: EntityTarget<T>, entities: T[] | T) => {
        const repository = await getRepository<T>(entityClass)

        let result: CountResult = {
            count: 0
        }

        await repository.delete(entities as any)

        result.count = await repository.count()

        return result
    }

    const update = async <T extends ObjectLiteral>(entityClass: EntityTarget<T>, entity: any) => {
        const repository = await getRepository<T>(entityClass)

        const entityInDb = await repository.findOne({ where: { id: entity.id } })

        const newEntity: T = {
            ...entityInDb,
            ...entity
        }

        await repository.save(newEntity)

        const updated: T | null = await repository.findOne({ where: { id: entity.id } })

        if (!updated) {
            throw 'Update error: Cant find entity after update'
        }

        let result: UpdateResult<T> = {
            data: updated
        }
        return result
    }

    return {
        dispose,
        read,
        count,
        create,
        remove,
        update,
        init
    }
}

export default EntityManager
