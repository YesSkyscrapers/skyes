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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterTypes = exports.mapFilters = void 0;
var typeorm_1 = require("typeorm");
var FilterTypes = {
    LIKE: 'like',
    MORE_THAN: 'morethan',
    MORE_THAN_OR_EQUAL: 'morethanorqueal',
    LESS_THAN: 'lessthan',
    LESS_THAN_OR_EQUAL: 'lessthanorqueal',
    BETWEEN: 'between',
    IN: 'in',
    NOT_NULL: 'notnull',
    NULL: 'null',
    EQUAL: 'equal',
    NOT_EQUAL: 'notequal',
    ORDER: 'order'
};
exports.FilterTypes = FilterTypes;
var mapFilters = function (filters) {
    var whereObject = {};
    var orderObject = {};
    if (filters.length == 0) {
        return {
            whereObject: undefined,
            orderObject: undefined
        };
    }
    filters.forEach(function (filter) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        switch (filter.type) {
            case FilterTypes.LIKE: {
                whereObject = __assign(__assign({}, whereObject), (_a = {}, _a[filter.key] = (0, typeorm_1.Like)(filter.value), _a));
                break;
            }
            case FilterTypes.MORE_THAN: {
                whereObject = __assign(__assign({}, whereObject), (_b = {}, _b[filter.key] = (0, typeorm_1.MoreThan)(filter.value), _b));
                break;
            }
            case FilterTypes.MORE_THAN_OR_EQUAL: {
                whereObject = __assign(__assign({}, whereObject), (_c = {}, _c[filter.key] = (0, typeorm_1.MoreThanOrEqual)(filter.value), _c));
                break;
            }
            case FilterTypes.LESS_THAN: {
                whereObject = __assign(__assign({}, whereObject), (_d = {}, _d[filter.key] = (0, typeorm_1.LessThan)(filter.value), _d));
                break;
            }
            case FilterTypes.LESS_THAN_OR_EQUAL: {
                whereObject = __assign(__assign({}, whereObject), (_e = {}, _e[filter.key] = (0, typeorm_1.LessThanOrEqual)(filter.value), _e));
                break;
            }
            case FilterTypes.BETWEEN: {
                whereObject = __assign(__assign({}, whereObject), (_f = {}, _f[filter.key] = (0, typeorm_1.Between)(filter.value[0], filter.value[1]), _f));
                break;
            }
            case FilterTypes.IN: {
                whereObject = __assign(__assign({}, whereObject), (_g = {}, _g[filter.key] = (0, typeorm_1.In)(filter.value), _g));
                break;
            }
            case FilterTypes.NOT_NULL: {
                whereObject = __assign(__assign({}, whereObject), (_h = {}, _h[filter.key] = (0, typeorm_1.Not)((0, typeorm_1.IsNull)()), _h));
                break;
            }
            case FilterTypes.NULL: {
                whereObject = __assign(__assign({}, whereObject), (_j = {}, _j[filter.key] = (0, typeorm_1.IsNull)(), _j));
                break;
            }
            case FilterTypes.EQUAL: {
                whereObject = __assign(__assign({}, whereObject), (_k = {}, _k[filter.key] = (0, typeorm_1.Equal)(filter.value), _k));
                break;
            }
            case FilterTypes.NOT_EQUAL: {
                whereObject = __assign(__assign({}, whereObject), (_l = {}, _l[filter.key] = (0, typeorm_1.Not)((0, typeorm_1.Equal)(filter.value)), _l));
                break;
            }
            case FilterTypes.ORDER: {
                orderObject = __assign(__assign({}, orderObject), (_m = {}, _m[filter.key] = filter.value, _m));
            }
        }
    });
    var result = {
        whereObject: whereObject,
        orderObject: orderObject
    };
    return result;
};
exports.mapFilters = mapFilters;
