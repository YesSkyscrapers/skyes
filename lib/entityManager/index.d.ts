import { Connection, ConnectionOptions, EntityTarget, ObjectLiteral } from 'typeorm';
import { CountResult, CreateManyResult, CreateResult, Filters, PaginationSettings, ReadResult, UpdateResult } from '../interfaces/interfaces';
declare class EntityManager {
    connection: Connection | null;
    constructor();
    checkConnection: () => void;
    init: (ormConfig: ConnectionOptions) => Promise<void>;
    dispose: () => Promise<void>;
    read: <T extends ObjectLiteral>(entityClass: EntityTarget<T>, pagination?: PaginationSettings, filters?: Filters) => Promise<ReadResult<T>>;
    count: <T extends ObjectLiteral>(entityClass: EntityTarget<T>, filters?: Filters) => Promise<CountResult>;
    create: <T extends ObjectLiteral>(entityClass: EntityTarget<T>, entity: any) => Promise<CreateResult<T>>;
    createEntities: <T extends ObjectLiteral>(entityClass: EntityTarget<T>, entities: Array<any>) => Promise<CreateManyResult<T>>;
    deleteEntities: <T extends ObjectLiteral>(entityClass: EntityTarget<T>, entities?: T[]) => Promise<CountResult>;
    updateEntity: <T extends ObjectLiteral>(entityClass: EntityTarget<T>, entity: any) => Promise<UpdateResult<T>>;
    getRepository: <T extends ObjectLiteral>(entityClass: EntityTarget<T>) => Promise<import("typeorm").Repository<T> | undefined>;
}
declare const entityManager: EntityManager;
export default entityManager;
