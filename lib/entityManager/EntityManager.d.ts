import { DataSourceOptions, EntityTarget, ObjectLiteral } from 'typeorm';
import { CountResult, CreateResult, Filter, PaginationSettings, ReadResult, UpdateResult } from './types';
declare const EntityManager: (dataSourceOptions: DataSourceOptions | any) => {
    dispose: () => Promise<void>;
    read: <T extends ObjectLiteral>(entityClass: EntityTarget<T>, pagination: PaginationSettings, filters?: Filter[]) => Promise<ReadResult<T>>;
    count: <T_1 extends ObjectLiteral>(entityClass: EntityTarget<T_1>, filters?: Filter[]) => Promise<CountResult>;
    create: <T_2 extends ObjectLiteral>(entityClass: EntityTarget<T_2>, entities: T_2 | T_2[]) => Promise<CreateResult<T_2>>;
    remove: <T_3 extends ObjectLiteral>(entityClass: EntityTarget<T_3>, entities: T_3 | T_3[]) => Promise<CountResult>;
    update: <T_4 extends ObjectLiteral>(entityClass: EntityTarget<T_4>, entity: any) => Promise<UpdateResult<T_4>>;
    init: () => Promise<void>;
};
export default EntityManager;
