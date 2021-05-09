import { Repository } from "typeorm";

interface ReadOutput {
    data: Array<any>;
    count: number;
}

interface CreateOutput {
    count: number;
    entity: any;
}

interface DeleteOutput {
    count: number;
}

interface UpdateOutput {
    data: any;
}

interface Filter {
    type: string;
    key: string;
    value: string | string[] | boolean | number | number[] | any;
}

declare namespace entityManager {
    function registerEntity(type: any): void;
    function init(): void;
    function init(ormconfig: any): void;
    function read(entityDefinition: any, pageSize: number, pageIndex: number): Promise<ReadOutput>;
    function read(entityDefinition: any, pageSize: number, pageIndex: number, filters: Array<Filter>): Promise<ReadOutput>;
    function read(entityDefinition: any, pageSize: number, pageIndex: number, filters: Array<Filter>, order: string): Promise<ReadOutput>;
    function create(entityDefinition: any, entity: any): CreateOutput;
    function update(entityDefinition: any, entity: any): UpdateOutput;
    function deleteEntities(entityDefinition: any, entities: any): DeleteOutput;
    function getRepository(entityDefinition: any): Promise<Repository>;
    function dispose(): Promise<void>;
}

export default entityManager;