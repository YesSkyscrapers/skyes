"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArg = exports.getRequestInfo = exports.checkUrlPatterns = exports.getRequestObject = exports.createResponseObject = void 0;
var tools_1 = require("../tools");
var process_1 = require("process");
var getRequestInfo = function (httpRequest) {
    return new Promise(function (resolve, reject) {
        var _a = httpRequest.url.split('?'), _url = _a[0], params = _a[1], notUsed = _a.slice(2);
        var url = _url;
        if (url.startsWith('/')) {
            url = url.slice(1);
        }
        if (url.endsWith('/')) {
            url = url.slice(0, -1);
        }
        var requestObject = {
            url: url,
            paramsObject: (0, tools_1.paramsToObject)(params),
            method: httpRequest.method,
            headers: [],
            body: {}
        };
        resolve(requestObject);
    });
};
exports.getRequestInfo = getRequestInfo;
var getRequestObject = function (httpRequest) {
    return new Promise(function (resolve, reject) {
        var _a = httpRequest.url.split('?'), _url = _a[0], params = _a[1], notUsed = _a.slice(2);
        var url = _url;
        if (url.startsWith('/')) {
            url = url.slice(1);
        }
        if (url.endsWith('/')) {
            url = url.slice(0, -1);
        }
        var requestObject = {
            url: url,
            paramsObject: (0, tools_1.paramsToObject)(params),
            method: httpRequest.method,
            body: {},
            headers: []
        };
        var rawBody = [];
        Object.keys(httpRequest.headers).forEach(function (key) {
            var value = httpRequest.headers[key];
            requestObject.headers.push({ key: key, value: value });
        });
        httpRequest.on('error', function (error) {
            reject("Body fetching error: ".concat(error));
        });
        httpRequest.on('data', function (chunk) {
            rawBody.push(chunk);
        });
        httpRequest.on('end', function () {
            try {
                try {
                    requestObject.body = JSON.parse(Buffer.concat(rawBody).toString());
                }
                catch (error) {
                    requestObject.body = {};
                }
                resolve(requestObject);
            }
            catch (error) {
                reject("JSON parse error: ".concat(error));
            }
        });
    });
};
exports.getRequestObject = getRequestObject;
var uniqueId = 0;
var createResponseObject = function (config) { return function (url) {
    return new Promise(function (resolve, reject) {
        var headers = [];
        headers.push({
            key: 'Content-Type',
            value: 'application/json'
        });
        if (config.defaultHeaders) {
            Object.keys(config.defaultHeaders).forEach(function (key) {
                headers.push({
                    key: key,
                    value: config.defaultHeaders[key]
                });
            });
        }
        var responseObject = {
            url: url,
            body: {},
            headers: headers,
            disableProcessing: false,
            requestId: uniqueId++
        };
        resolve(responseObject);
    });
}; };
exports.createResponseObject = createResponseObject;
var checkUrlPatterns = function (config) { return function (handlerUrl, requestUrl) {
    var subUrl = config.subUrl;
    var _requestUrl = requestUrl.startsWith(subUrl) ? requestUrl.slice(subUrl.length) : requestUrl;
    var splittedHandlerUrl = handlerUrl.split('/');
    var splittedRequestUrl = _requestUrl.split('/');
    if (splittedHandlerUrl.length != splittedRequestUrl.length) {
        var returnValue = {
            result: false,
            params: {}
        };
        return returnValue;
    }
    else {
        var result_1 = true;
        var params_1 = {};
        splittedHandlerUrl.forEach(function (handlerPart, index) {
            if (handlerPart.startsWith('{') && handlerPart.endsWith('}')) {
                params_1[handlerPart.slice(1, -1)] = splittedRequestUrl[index];
            }
            else {
                if (handlerPart != splittedRequestUrl[index]) {
                    result_1 = false;
                }
            }
        });
        var returnValue = { result: result_1, params: params_1 };
        return returnValue;
    }
}; };
exports.checkUrlPatterns = checkUrlPatterns;
var getArg = function (argName) {
    var argStr = "-".concat(argName, ":");
    var value = undefined;
    process_1.argv.forEach(function (value) {
        if (value.includes(argStr)) {
            value = value.split(argStr)[1];
        }
    });
    return value;
};
exports.getArg = getArg;
