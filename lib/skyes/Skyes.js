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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var tools_1 = require("./tools");
var disposeHandler_1 = __importDefault(require("../handlers/disposeHandler"));
var healthCheckHandler_1 = __importDefault(require("../handlers/healthCheckHandler"));
var errorHandler_1 = require("../handlers/errorHandler");
var moment = require('moment');
var Skyes = /** @class */ (function () {
    function Skyes(config) {
        var _this = this;
        this.getDefaultHandlers = function (config) {
            return [
                {
                    url: 'action',
                    method: 'POST',
                    handler: function (params) { return __awaiter(_this, void 0, void 0, function () {
                        var httpRequest, request, httpResponse, response, handlerParams, actionHandler, error_1, errorParams;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    httpRequest = params.httpRequest, request = params.request, httpResponse = params.httpResponse, response = params.response, handlerParams = params.handlerParams;
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 5, , 7]);
                                    actionHandler = this.actions.find(function (_action) { return _action.name == request.body.action; });
                                    if (!actionHandler) return [3 /*break*/, 3];
                                    return [4 /*yield*/, actionHandler.action(params)];
                                case 2:
                                    _a.sent();
                                    if (!response.disableProcessing) {
                                        response.headers.forEach(function (header) {
                                            httpResponse.setHeader(header.key, header.value);
                                        });
                                        httpResponse.end(response.body ? JSON.stringify(response.body) : undefined);
                                    }
                                    return [3 /*break*/, 4];
                                case 3: throw 'Action not found';
                                case 4: return [3 /*break*/, 7];
                                case 5:
                                    error_1 = _a.sent();
                                    errorParams = {
                                        httpRequest: httpRequest,
                                        httpResponse: httpResponse,
                                        error: error_1
                                    };
                                    return [4 /*yield*/, this.errorHandler(errorParams)];
                                case 6:
                                    _a.sent();
                                    return [3 /*break*/, 7];
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); }
                },
                {
                    url: 'dispose',
                    method: 'GET',
                    handler: (0, disposeHandler_1.default)(config, _this.stop)
                },
                {
                    url: 'healthcheck',
                    method: 'GET',
                    handler: (0, healthCheckHandler_1.default)(config)
                }
            ];
        };
        this.serverHandler = function (httpRequest, httpResponse) { return __awaiter(_this, void 0, void 0, function () {
            var response, request, info, handler, handlerParams, params, error_2, params;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createResponseObject(httpRequest.url)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, (0, tools_1.getRequestInfo)(httpRequest)];
                    case 2:
                        info = _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 10, , 12]);
                        handler = this.handlers.find(function (_handler) {
                            return ((!_handler.method || (_handler.method == info.method && !!_handler.method)) &&
                                _this.checkUrlPatterns(_handler.url, info.url).result);
                        });
                        if (!handler) return [3 /*break*/, 8];
                        if (!(handler.parseBody || handler.parseBody == undefined)) return [3 /*break*/, 5];
                        return [4 /*yield*/, (0, tools_1.getRequestObject)(httpRequest)];
                    case 4:
                        request = _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        request = info;
                        _a.label = 6;
                    case 6:
                        handlerParams = this.checkUrlPatterns(handler.url, request.url).params;
                        params = {
                            httpRequest: httpRequest,
                            request: request,
                            httpResponse: httpResponse,
                            response: response,
                            handlerParams: handlerParams
                        };
                        return [4 /*yield*/, handler.handler(params)];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 8: throw 'Handler not found';
                    case 9: return [3 /*break*/, 12];
                    case 10:
                        error_2 = _a.sent();
                        params = {
                            httpRequest: httpRequest,
                            httpResponse: httpResponse,
                            error: error_2
                        };
                        return [4 /*yield*/, this.errorHandler(params)];
                    case 11:
                        _a.sent();
                        return [3 /*break*/, 12];
                    case 12: return [2 /*return*/];
                }
            });
        }); };
        this.start = function () { return __awaiter(_this, void 0, void 0, function () {
            var error_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                _this.httpServer.listen(_this.port, function () {
                                    console.log("".concat(moment().format('DD.MM HH:mm:ss'), ": Skyes started on port: ").concat(_this.port));
                                    resolve(null);
                                });
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        throw "".concat(moment().format('DD.MM HH:mm:ss'), ": Server start failed with error: ").concat(error_3);
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.stop = function () { return __awaiter(_this, void 0, void 0, function () {
            var error_4;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                _this.httpServer.close(function () {
                                    console.log("".concat(moment().format('HH:mm:ss'), ": Local server stopped"));
                                    resolve(null);
                                });
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        throw "".concat(moment().format('HH:mm:ss'), ": Server stop failed with error: ").concat(error_4);
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.addAction = function (params) {
            _this.actions.push(params);
        };
        this.addHandler = function (params) {
            var url = params.url, method = params.method, handler = params.handler, parseBody = params.parseBody;
            if (url == 'action') {
                throw 'Action handler reserved';
            }
            else {
                _this.handlers.push(params);
            }
        };
        this.getConfig = function () {
            return _this.serverConfig;
        };
        this.serverConfig = config;
        this.handlers = this.getDefaultHandlers(config);
        this.actions = [];
        this.httpServer = http_1.default.createServer(this.serverHandler);
        var cmdPort = (0, tools_1.getArg)('port');
        this.port = cmdPort && Number(cmdPort) !== Number.NaN ? Number(cmdPort) : this.serverConfig.defaultPort;
        this.errorHandler = (0, errorHandler_1.errorHandler)(config);
        this.createResponseObject = (0, tools_1.createResponseObject)(config);
        this.checkUrlPatterns = (0, tools_1.checkUrlPatterns)(config);
    }
    return Skyes;
}());
exports.default = Skyes;
