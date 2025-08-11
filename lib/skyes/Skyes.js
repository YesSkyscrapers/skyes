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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const moment_1 = __importDefault(require("moment"));
const tools_1 = require("./tools");
const errorHandler_1 = require("./handlers/errorHandler");
const healthcheckHandler_1 = __importDefault(require("./handlers/healthcheckHandler"));
const actionHandler_1 = require("./handlers/actionHandler");
const DisabledAuthModule_1 = __importDefault(require("./authModule/DisabledAuthModule"));
const Skyes = (initParams) => {
    const actions = [];
    const authModule = initParams.authModule ? initParams.authModule : (0, DisabledAuthModule_1.default)();
    const getActions = () => actions;
    const handlers = [
        {
            path: 'healthcheck',
            method: 'GET',
            handle: healthcheckHandler_1.default
        },
        {
            path: 'action',
            method: 'POST',
            handle: (0, actionHandler_1.getActionHandler)(getActions, authModule)
        }
    ];
    const handleRequest = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            (0, tools_1.fillResponseWithBasicHeaders)(response, initParams.constHeaders);
            const requestUrl = (0, tools_1.subtractCustomPath)(request.url, initParams.customPath);
            const handlersWithSameMethod = handlers.filter((item) => !item.method || item.method === request.method);
            let selectedHandler = null;
            let selectedHandlerAssociateInfo = null;
            for (const handler of handlersWithSameMethod) {
                const associateInfo = (0, tools_1.associatePathPattern)({ url: requestUrl, pattern: handler.path });
                if (associateInfo.isSame) {
                    selectedHandler = handler;
                    selectedHandlerAssociateInfo = associateInfo;
                    break;
                }
            }
            if (!selectedHandler) {
                const simpleHandlers = handlers.filter((item) => !!item.simpleStartOf);
                for (const handler of simpleHandlers) {
                    if (requestUrl.startsWith(handler.simpleStartOf)) {
                        selectedHandler = handler;
                        selectedHandlerAssociateInfo = { isSame: true, params: {} };
                        break;
                    }
                }
            }
            if (selectedHandler) {
                if (selectedHandler.verifyAuth) {
                    yield authModule.check(request);
                }
                yield selectedHandler.handle(request, response, selectedHandlerAssociateInfo.params);
            }
            else {
                throw 'Handler not found';
            }
        }
        catch (err) {
            yield (0, errorHandler_1.getErrorHandler)(request, response, (err === null || err === void 0 ? void 0 : err.message) ? err.message : err);
        }
    });
    const httpServer = http_1.default.createServer(handleRequest);
    const start = () => {
        return new Promise((resolve, reject) => {
            try {
                httpServer.listen(initParams.port, (initParams === null || initParams === void 0 ? void 0 : initParams.host) || '0.0.0.0', () => {
                    console.log(`${(0, moment_1.default)().format('DD.MM HH:mm:ss')}: Skyes started on port: ${initParams.port}`);
                    resolve(null);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    };
    const stop = () => {
        return new Promise((resolve, reject) => {
            try {
                httpServer.close((err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        console.log(`${(0, moment_1.default)().format('DD.MM HH:mm:ss')}: Skyes stopped`);
                        resolve(null);
                    }
                });
            }
            catch (err) {
                reject(err);
            }
        });
    };
    const addAction = ({ name, handle, verifyAuth }) => {
        actions.push({
            name,
            handle,
            verifyAuth
        });
    };
    const addHandler = ({ path, method, handle, verifyAuth, simpleStartOf }) => {
        if (path == 'action') {
            throw 'Action handler reserved';
        }
        else {
            handlers.push({
                path,
                method,
                handle,
                verifyAuth,
                simpleStartOf
            });
        }
    };
    return {
        start,
        stop,
        addAction,
        addHandler
    };
};
exports.default = Skyes;
