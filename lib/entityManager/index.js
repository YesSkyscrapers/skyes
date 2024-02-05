"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var tools_1 = require("./tools");
var DEFAULT_PAGINATION = {
    pageSize: 10,
    pageIndex: 0
};
var DEFAULT_FILTERS = [];
var EntityManager = /** @class */ (function () {
    function EntityManager() {
        var _this = this;
        this.checkConnection = function () {
            if (!_this.connection) {
                throw 'EntityManager DB connection not established';
            }
        };
        this.init = function (ormConfig) { return __awaiter(_this, void 0, void 0, function () {
            var _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = this;
                        return [4 /*yield*/, (0, typeorm_1.createConnection)(ormConfig)];
                    case 1:
                        _a.connection = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        throw "EntityManager not created connection: ".concat(error_1);
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.dispose = function () { return __awaiter(_this, void 0, void 0, function () {
            var error_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, ((_a = this.connection) === null || _a === void 0 ? void 0 : _a.close())];
                    case 1:
                        _b.sent();
                        console.log('EntityManager connection disposed.');
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _b.sent();
                        throw "EntityManager connection dispose failed: ".concat(error_2);
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.read = function (entityClass, pagination, filters) {
            if (pagination === void 0) { pagination = DEFAULT_PAGINATION; }
            if (filters === void 0) { filters = DEFAULT_FILTERS; }
            return __awaiter(_this, void 0, void 0, function () {
                var repository, result, _a, whereObject, orderObject, _b, _c;
                var _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            this.checkConnection();
                            repository = (_d = this.connection) === null || _d === void 0 ? void 0 : _d.getRepository(entityClass);
                            result = {
                                data: [],
                                count: -1
                            };
                            _a = (0, tools_1.mapFilters)(filters), whereObject = _a.whereObject, orderObject = _a.orderObject;
                            _b = result;
                            return [4 /*yield*/, repository.find({
                                    skip: pagination.pageIndex * pagination.pageSize,
                                    take: pagination.pageSize,
                                    where: whereObject ? whereObject : undefined,
                                    order: orderObject ? orderObject : undefined
                                })];
                        case 1:
                            _b.data = _e.sent();
                            _c = result;
                            return [4 /*yield*/, repository.count({
                                    skip: pagination.pageIndex * pagination.pageSize,
                                    take: pagination.pageSize,
                                    where: whereObject ? whereObject : undefined,
                                    order: orderObject ? orderObject : undefined
                                })];
                        case 2:
                            _c.count = _e.sent();
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        this.count = function (entityClass, filters) {
            if (filters === void 0) { filters = DEFAULT_FILTERS; }
            return __awaiter(_this, void 0, void 0, function () {
                var repository, _a, whereObject, orderObject, result, _b;
                var _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            this.checkConnection();
                            repository = (_c = this.connection) === null || _c === void 0 ? void 0 : _c.getRepository(entityClass);
                            _a = (0, tools_1.mapFilters)(filters), whereObject = _a.whereObject, orderObject = _a.orderObject;
                            result = {
                                count: -1
                            };
                            _b = result;
                            return [4 /*yield*/, repository.count({
                                    where: whereObject ? whereObject : undefined,
                                    order: orderObject ? orderObject : undefined
                                })];
                        case 1:
                            _b.count = _d.sent();
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        this.create = function (entityClass, entity) { return __awaiter(_this, void 0, void 0, function () {
            var repository, result;
            var _a;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.checkConnection();
                        repository = (_b = this.connection) === null || _b === void 0 ? void 0 : _b.getRepository(entityClass);
                        _a = {};
                        return [4 /*yield*/, repository.save(entity)];
                    case 1:
                        _a.entity = _c.sent();
                        return [4 /*yield*/, repository.count()];
                    case 2:
                        result = (_a.count = _c.sent(),
                            _a);
                        return [2 /*return*/, result];
                }
            });
        }); };
        this.createEntities = function (entityClass, entities) { return __awaiter(_this, void 0, void 0, function () {
            var repository, result;
            var _a;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.checkConnection();
                        repository = (_b = this.connection) === null || _b === void 0 ? void 0 : _b.getRepository(entityClass);
                        _a = {};
                        return [4 /*yield*/, repository.save(entities)];
                    case 1:
                        _a.entities = _c.sent();
                        return [4 /*yield*/, repository.count()];
                    case 2:
                        result = (_a.count = _c.sent(),
                            _a);
                        return [2 /*return*/, result];
                }
            });
        }); };
        this.deleteEntities = function (entityClass, entities) {
            if (entities === void 0) { entities = []; }
            return __awaiter(_this, void 0, void 0, function () {
                var repository, result, _a;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            this.checkConnection();
                            repository = (_b = this.connection) === null || _b === void 0 ? void 0 : _b.getRepository(entityClass);
                            result = {
                                count: -1
                            };
                            return [4 /*yield*/, repository.delete(entities)];
                        case 1:
                            _c.sent();
                            _a = result;
                            return [4 /*yield*/, repository.count()];
                        case 2:
                            _a.count = _c.sent();
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        this.updateEntity = function (entityClass, entity) { return __awaiter(_this, void 0, void 0, function () {
            var repository, entityInDb, newEntity, result;
            var _a;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.checkConnection();
                        repository = (_b = this.connection) === null || _b === void 0 ? void 0 : _b.getRepository(entityClass);
                        return [4 /*yield*/, repository.findOne(entity.id)];
                    case 1:
                        entityInDb = _c.sent();
                        newEntity = __assign(__assign({}, entityInDb), entity);
                        return [4 /*yield*/, repository.save(newEntity)];
                    case 2:
                        _c.sent();
                        _a = {};
                        return [4 /*yield*/, repository.findOne(entity.id)];
                    case 3:
                        result = (_a.data = (_c.sent()),
                            _a);
                        return [2 /*return*/, result];
                }
            });
        }); };
        this.getRepository = function (entityClass) { return __awaiter(_this, void 0, void 0, function () {
            var repository;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.checkConnection();
                        return [4 /*yield*/, ((_a = this.connection) === null || _a === void 0 ? void 0 : _a.getRepository(entityClass))];
                    case 1:
                        repository = _b.sent();
                        return [2 /*return*/, repository];
                }
            });
        }); };
        this.connection = null;
    }
    return EntityManager;
}());
var entityManager = new EntityManager();
exports.default = entityManager;
