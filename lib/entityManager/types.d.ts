import { EntityTarget, FindOptionsOrder, FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';
type PaginationSettings = {
    pageSize: number;
    pageIndex: number;
};
interface RepositoryItem<T extends ObjectLiteral> {
    entity: EntityTarget<T>;
    repository: Repository<T>;
}
type Filter = {
    type: FilterTypes;
    key: string;
    value: string | number | boolean | number[];
};
declare enum FilterTypes {
    LIKE = "like",
    MORE_THAN = "morethan",
    MORE_THAN_OR_EQUAL = "morethanorqueal",
    LESS_THAN = "lessthan",
    LESS_THAN_OR_EQUAL = "lessthanorqueal",
    BETWEEN = "between",
    IN = "in",
    NOT_NULL = "notnull",
    NULL = "null",
    EQUAL = "equal",
    NOT_EQUAL = "notequal",
    ORDER = "order"
}
interface FiltersMap<T> {
    whereObject: FindOptionsWhere<T>[] | FindOptionsWhere<T> | undefined;
    orderObject: FindOptionsOrder<T> | undefined;
}
type ReadResult<T> = {
    data: T[];
    count: number;
};
interface CountResult {
    count: number;
}
interface CreateResult<T> {
    entities: T[];
    count: number;
}
interface UpdateResult<T> {
    data: T;
}
export { PaginationSettings, RepositoryItem, Filter, ReadResult, FilterTypes, FiltersMap, CountResult, CreateResult, UpdateResult };
