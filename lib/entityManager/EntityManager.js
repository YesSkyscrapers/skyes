"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const tools_1 = require("./tools");
const EntityManager = (dataSourceOptions) => {
    let source = null;
    let repositories = [];
    const init = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            source = new typeorm_1.DataSource(dataSourceOptions);
            if (!source.isInitialized) {
                yield source.initialize();
            }
        }
        catch (error) {
            throw `EntityManager can't connect to source: ${error}`;
        }
    });
    const dispose = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (source) {
                yield source.destroy();
                console.log('EntityManager source destroyed.');
            }
        }
        catch (error) {
            throw `EntityManager source destroy failed: ${error}`;
        }
    });
    const getRepository = (entityClass) => __awaiter(void 0, void 0, void 0, function* () {
        if (!source) {
            throw 'Source not initialized';
        }
        let exists = repositories.find((item) => item.entity === entityClass);
        if (exists) {
            return exists.repository;
        }
        else {
            if (source) {
                const repository = yield source.getRepository(entityClass);
                repositories.push({
                    entity: entityClass,
                    repository: repository
                });
                return repository;
            }
            else {
                throw 'EntityManager source not inited';
            }
        }
    });
    const read = (entityClass, pagination, filters = []) => __awaiter(void 0, void 0, void 0, function* () {
        const repository = yield getRepository(entityClass);
        let result = {
            data: [],
            count: 0
        };
        const { whereObject, orderObject } = (0, tools_1.mapFilters)(filters);
        result.data = yield repository.find({
            skip: pagination.pageIndex * pagination.pageSize,
            take: pagination.pageSize,
            where: whereObject ? whereObject : undefined,
            order: orderObject ? orderObject : undefined
        });
        result.count = yield repository.count({
            where: whereObject ? whereObject : undefined,
            order: orderObject ? orderObject : undefined
        });
        return result;
    });
    const count = (entityClass, filters = []) => __awaiter(void 0, void 0, void 0, function* () {
        const repository = yield getRepository(entityClass);
        const { whereObject, orderObject } = (0, tools_1.mapFilters)(filters);
        let result = {
            count: -1
        };
        result.count = yield repository.count({
            where: whereObject ? whereObject : undefined,
            order: orderObject ? orderObject : undefined
        });
        return result;
    });
    const create = (entityClass, entities) => __awaiter(void 0, void 0, void 0, function* () {
        const repository = yield getRepository(entityClass);
        let result = {
            entities: Array.isArray(entities)
                ? yield repository.save(entities)
                : [yield repository.save(entities)],
            count: yield repository.count()
        };
        return result;
    });
    const remove = (entityClass, entities) => __awaiter(void 0, void 0, void 0, function* () {
        const repository = yield getRepository(entityClass);
        let result = {
            count: 0
        };
        yield repository.delete(entities);
        result.count = yield repository.count();
        return result;
    });
    const update = (entityClass, entity) => __awaiter(void 0, void 0, void 0, function* () {
        const repository = yield getRepository(entityClass);
        const entityInDb = yield repository.findOne({ where: { id: entity.id } });
        const newEntity = Object.assign(Object.assign({}, entityInDb), entity);
        yield repository.save(newEntity);
        const updated = yield repository.findOne({ where: { id: entity.id } });
        if (!updated) {
            throw 'Update error: Cant find entity after update';
        }
        let result = {
            data: updated
        };
        return result;
    });
    return {
        dispose,
        read,
        count,
        create,
        remove,
        update,
        init
    };
};
exports.default = EntityManager;
