"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterTypes = exports.mapFilters = void 0;
const typeorm_1 = require("typeorm");
const types_1 = require("./types");
Object.defineProperty(exports, "FilterTypes", { enumerable: true, get: function () { return types_1.FilterTypes; } });
const mapFilters = (filters) => {
    let whereObject = {};
    let orderObject = {};
    if (filters.length == 0) {
        return {
            whereObject: undefined,
            orderObject: undefined
        };
    }
    filters.forEach((filter) => {
        switch (filter.type) {
            case types_1.FilterTypes.LIKE: {
                whereObject = Object.assign(Object.assign({}, whereObject), { [filter.key]: (0, typeorm_1.Like)(filter.value) });
                break;
            }
            case types_1.FilterTypes.MORE_THAN: {
                whereObject = Object.assign(Object.assign({}, whereObject), { [filter.key]: (0, typeorm_1.MoreThan)(filter.value) });
                break;
            }
            case types_1.FilterTypes.MORE_THAN_OR_EQUAL: {
                whereObject = Object.assign(Object.assign({}, whereObject), { [filter.key]: (0, typeorm_1.MoreThanOrEqual)(filter.value) });
                break;
            }
            case types_1.FilterTypes.LESS_THAN: {
                whereObject = Object.assign(Object.assign({}, whereObject), { [filter.key]: (0, typeorm_1.LessThan)(filter.value) });
                break;
            }
            case types_1.FilterTypes.LESS_THAN_OR_EQUAL: {
                whereObject = Object.assign(Object.assign({}, whereObject), { [filter.key]: (0, typeorm_1.LessThanOrEqual)(filter.value) });
                break;
            }
            case types_1.FilterTypes.BETWEEN: {
                if (Array.isArray(filter.value)) {
                    whereObject = Object.assign(Object.assign({}, whereObject), { [filter.key]: (0, typeorm_1.Between)(filter.value[0], filter.value[1]) });
                }
                break;
            }
            case types_1.FilterTypes.IN: {
                if (Array.isArray(filter.value)) {
                    whereObject = Object.assign(Object.assign({}, whereObject), { [filter.key]: (0, typeorm_1.In)(filter.value) });
                }
                break;
            }
            case types_1.FilterTypes.NOT_NULL: {
                whereObject = Object.assign(Object.assign({}, whereObject), { [filter.key]: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) });
                break;
            }
            case types_1.FilterTypes.NULL: {
                whereObject = Object.assign(Object.assign({}, whereObject), { [filter.key]: (0, typeorm_1.IsNull)() });
                break;
            }
            case types_1.FilterTypes.EQUAL: {
                whereObject = Object.assign(Object.assign({}, whereObject), { [filter.key]: (0, typeorm_1.Equal)(filter.value) });
                break;
            }
            case types_1.FilterTypes.NOT_EQUAL: {
                whereObject = Object.assign(Object.assign({}, whereObject), { [filter.key]: (0, typeorm_1.Not)((0, typeorm_1.Equal)(filter.value)) });
                break;
            }
            case types_1.FilterTypes.ORDER: {
                orderObject = Object.assign(Object.assign({}, orderObject), { [filter.key]: filter.value });
            }
        }
    });
    let result = {
        whereObject: whereObject,
        orderObject: orderObject
    };
    return result;
};
exports.mapFilters = mapFilters;
