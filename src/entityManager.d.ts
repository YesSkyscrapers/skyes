interface ReadOutput {
    data: [];
    count: number;
}

interface CreateOutput {
    count: number;
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
    value: string;
}

declare namespace entityManager {
    function registerEntity(type: any): void;
    function init(): void;
    function saveEntity(entity: any): void;
    function read(entityDefinition: any, pageSize: number, pageIndex: number): ReadOutput;
    function read(entityDefinition: any, pageSize: number, pageIndex: number, filters: Array<Filter>): ReadOutput;
    function create(entityDefinition: any, entity: any): CreateOutput;
    function update(entityDefinition: any, entity: any): UpdateOutput;
    function deleteEntities(entityDefinition: any, entities: any): DeleteOutput;
}

export default entityManager;