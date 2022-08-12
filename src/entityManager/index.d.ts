import { Repository } from 'typeorm'

interface PaginationSettings {
    pageSize: number;
    pageIndex: number;
}

interface Filter {
    type: string;
    key: string;
    value: any;
}

interface Filters extends Array<Filter> { }

interface ReadResult<T> {
    data: Array<T>;
    count: number;
}

interface CountResult {
    count: number;
}

interface CreateResult<T> {
    entity: T;
    count: number;
}

interface DeleteResult {
    count: number;
}

interface UpdateResult<T> {
    data: T
}

declare class EntityManager {
    checkConnection(): void;
    init(ormConfig: any): Promise<void>;
    dispose(): Promise<void>;
    read<T>(entityClass: new () => T, pagination: PaginationSettings, filters: Filters): Promise<ReadResult<T>>;
    count(entityClass: any, filters: Filters): Promise<CountResult>;
    create<T>(entityClass: new () => T, entity: any): Promise<CreateResult<T>>;
    createEntities<T>(entityClass: new () => T, entities: Array<any>): Promise<CreateResult<T>>;
    deleteEntities(entityClass: any, entities: Array<any>): Promise<DeleteResult>;
    updateEntity<T>(entityClass: new () => T, entity: any): Promise<UpdateResult<T>>;
    getRepository<T>(entityClass: T): Promise<Repository<T>>;
}



export default entityManager;
declare let entityManager: EntityManager;



