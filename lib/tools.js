"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitFor = exports.paramsToObject = exports.objectToParams = void 0;
var objectToParams = function (object) {
    Object.keys(object).forEach(function (key) { return (object[key] === undefined ? delete object[key] : ''); });
    var params = '';
    for (var key in object) {
        if (params != '') {
            params += '&';
        }
        params += key + '=' + encodeURIComponent(object[key]);
    }
    return params;
};
exports.objectToParams = objectToParams;
var paramsToObject = function (params) {
    try {
        return JSON.parse('{"' + decodeURI(params).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
    }
    catch (error) {
        return {};
    }
};
exports.paramsToObject = paramsToObject;
var waitFor = function (delay) {
    return new Promise(function (res) {
        setTimeout(function () {
            return res(null);
        }, delay);
    });
};
exports.waitFor = waitFor;
