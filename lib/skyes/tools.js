"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fillResponseWithBasicHeaders = exports.subtractCustomPath = exports.associatePathPattern = exports.getPathArray = void 0;
const constants_1 = require("../constants");
const subtractCustomPath = (url, customPath = '/') => {
    const urlAvoidingDash = url.slice(url.startsWith('/') ? 1 : 0);
    const lowerUrlAvoidingDash = urlAvoidingDash.toLowerCase();
    return lowerUrlAvoidingDash.startsWith(customPath)
        ? lowerUrlAvoidingDash.slice(customPath.length)
        : lowerUrlAvoidingDash;
};
exports.subtractCustomPath = subtractCustomPath;
const getPathArray = (url) => {
    const splitted = url.split('/');
    return splitted.filter((part) => part.length > 0);
};
exports.getPathArray = getPathArray;
const associatePathPattern = ({ url, pattern }) => {
    const urlPathArray = getPathArray(url);
    const patternPathArray = getPathArray(pattern);
    if (urlPathArray.length == patternPathArray.length) {
        let result = {
            isSame: true,
            params: {}
        };
        for (let [patternPathIndex, patternPathPart] of patternPathArray.entries()) {
            const isPartVariable = patternPathPart.startsWith('{') && patternPathPart.endsWith('}');
            if (isPartVariable) {
                result.params[patternPathPart.slice(1, -1)] = urlPathArray[patternPathIndex];
            }
            else {
                if (patternPathPart !== urlPathArray[patternPathIndex]) {
                    result.isSame = false;
                    break;
                }
            }
        }
        return result;
    }
    else {
        return {
            isSame: false
        };
    }
};
exports.associatePathPattern = associatePathPattern;
const fillResponseWithBasicHeaders = (response, constHeaders = {}) => {
    Object.entries(Object.assign(Object.assign({}, constants_1.DEFAULT_HEADERS), constHeaders)).forEach(([key, value]) => {
        response.setHeader(key, value);
    });
};
exports.fillResponseWithBasicHeaders = fillResponseWithBasicHeaders;
