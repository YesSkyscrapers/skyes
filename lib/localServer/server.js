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
exports.Server = exports.Config = void 0;
var globalHandler_1 = require("./globalHandler");
var http_1 = __importDefault(require("http"));
var process_1 = require("process");
var moment = require('moment');
var Config = /** @class */ (function () {
    function Config(props) {
        this.defaultHeaders = (props === null || props === void 0 ? void 0 : props.defaultHeaders) || {};
        this.defaultPort = (props === null || props === void 0 ? void 0 : props.defaultPort) || 3030;
        this.subUrl = (props === null || props === void 0 ? void 0 : props.subUrl) || '';
    }
    return Config;
}());
exports.Config = Config;
var Server = /** @class */ (function () {
    function Server() {
        var _this = this;
        this.start = function (config) { return __awaiter(_this, void 0, void 0, function () {
            var port_1, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.serverConfig = new Config(config);
                        port_1 = this.serverConfig.defaultPort;
                        process_1.argv.forEach(function (value) {
                            if (value.includes('-port:')) {
                                port_1 = Number(value.split('-port:')[1]);
                            }
                        });
                        this.httpServer = http_1.default.createServer(globalHandler_1.globalHandler);
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                _this.httpServer.listen(port_1, function () {
                                    console.log("".concat(moment().format('DD.MM HH:mm:ss'), ": Skyes started on port: ").concat(port_1));
                                    resolve(null);
                                });
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        throw "".concat(moment().format('DD.MM HH:mm:ss'), ": Server start failed with error: ").concat(error_1);
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.stop = function () { return __awaiter(_this, void 0, void 0, function () {
            var error_2;
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
                        error_2 = _a.sent();
                        throw "".concat(moment().format('HH:mm:ss'), ": Server stop failed with error: ").concat(error_2);
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.getConfig = function () {
            return _this.serverConfig;
        };
        this.serverConfig = new Config();
        this.httpServer = null;
    }
    return Server;
}());
exports.Server = Server;
var server = new Server();
exports.default = server;
