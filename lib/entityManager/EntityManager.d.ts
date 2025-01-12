import { DataSource, DataSourceOptions, EntityTarget, ObjectLiteral, Repository } from 'typeorm';
import { CountResult, CreateManyResult, CreateResult, Filters, ReadResult, UpdateResult } from '../interfaces/interfaces';
interface RepositoryItem<T extends ObjectLiteral> {
    entity: EntityTarget<T>;
    repository: Repository<T>;
}
interface PaginationSettings {
    pageSize: number;
    pageIndex: number;
}
declare class EntityManager {
    source: DataSource;
    repositories: RepositoryItem<any>[];
    constructor(dataSourceOptions: DataSourceOptions);
    init: () => Promise<void>;
    dispose: () => Promise<void>;
    getRepository: <T extends ObjectLiteral>(entityClass: EntityTarget<T>) => Promise<Repository<any>>;
    read: <T extends ObjectLiteral>(entityClass: EntityTarget<T>, pagination: PaginationSettings, filters?: Filters | undefined) => Promise<ReadResult<T>>;
    count: <T extends ObjectLiteral>(entityClass: EntityTarget<T>, filters?: Filters | undefined) => Promise<CountResult>;
    create: <T extends ObjectLiteral>(entityClass: EntityTarget<T>, entity: T) => Promise<CreateResult<T>>;
    createEntities: <T extends ObjectLiteral>(entityClass: EntityTarget<T>, entities: T[]) => Promise<CreateManyResult<T>>;
    deleteEntities: <T extends ObjectLiteral>(entityClass: EntityTarget<T>, entities?: T[]) => Promise<CountResult>;
    updateEntity: <T extends ObjectLiteral>(entityClass: EntityTarget<T>, entity: any) => Promise<UpdateResult<T>>;
}
export default EntityManager;
