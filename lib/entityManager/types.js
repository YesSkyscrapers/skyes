"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterTypes = void 0;
var FilterTypes;
(function (FilterTypes) {
    FilterTypes["LIKE"] = "like";
    FilterTypes["MORE_THAN"] = "morethan";
    FilterTypes["MORE_THAN_OR_EQUAL"] = "morethanorqueal";
    FilterTypes["LESS_THAN"] = "lessthan";
    FilterTypes["LESS_THAN_OR_EQUAL"] = "lessthanorqueal";
    FilterTypes["BETWEEN"] = "between";
    FilterTypes["IN"] = "in";
    FilterTypes["NOT_NULL"] = "notnull";
    FilterTypes["NULL"] = "null";
    FilterTypes["EQUAL"] = "equal";
    FilterTypes["NOT_EQUAL"] = "notequal";
    FilterTypes["ORDER"] = "order";
})(FilterTypes || (exports.FilterTypes = FilterTypes = {}));
