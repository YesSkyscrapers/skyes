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
exports.getActionHandler = void 0;
const HandlerTools_1 = __importDefault(require("../HandlerTools"));
const handler = (request, response, pathParams, params) => __awaiter(void 0, void 0, void 0, function* () {
    const actions = params.getActions();
    const authModule = params.authModule;
    const actionRequest = yield HandlerTools_1.default.getJsonBody(request);
    const selectedAction = actions.find((action) => action.name === actionRequest.action);
    if (selectedAction) {
        if (selectedAction.verifyAuth) {
            yield authModule.check(request);
        }
        let actionResponse = {};
        yield selectedAction.handle(actionRequest, actionResponse);
        response.end(actionResponse.body ? JSON.stringify(actionResponse.body) : undefined);
    }
    else {
        throw 'Action not found';
    }
});
const getActionHandler = (getActions, authModule) => (request, response) => handler(request, response, {}, { getActions: getActions, authModule: authModule });
exports.getActionHandler = getActionHandler;
