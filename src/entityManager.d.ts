declare namespace entityManager {
    function registerEntity(type: any): void;
    function init(): void;
    function saveEntity(entity: any): void
}

export default entityManager;