"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var globalActionHandler_1 = require("./globalActionHandler");
var globalHandler_1 = require("./globalHandler");
var server_1 = __importDefault(require("./server"));
var LocalServer = /** @class */ (function () {
    function LocalServer() {
        this.start = server_1.default.start;
        this.stop = server_1.default.stop;
        this.addHandler = globalHandler_1.addHandler;
        this.addAction = globalActionHandler_1.addAction;
    }
    return LocalServer;
}());
var localServer = new LocalServer();
exports.default = localServer;
