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
const moment_1 = __importDefault(require("moment"));
const HandlerTools_1 = __importDefault(require("../HandlerTools"));
const CachingAuthModule = ({ checkSession, cacheMSLife = 1000, headerParams }) => {
    let cache = [];
    const check = (request) => __awaiter(void 0, void 0, void 0, function* () {
        const device = HandlerTools_1.default.getHeaderValue(request, (headerParams === null || headerParams === void 0 ? void 0 : headerParams.deviceKey) || 'device');
        const token = HandlerTools_1.default.getHeaderValue(request, (headerParams === null || headerParams === void 0 ? void 0 : headerParams.tokenKey) || 'token');
        if (!device || !token) {
            throw 'Wrong auth headers';
        }
        else {
            const cacheRecord = cache.find((item) => item.token === token && item.device === device);
            if (cacheRecord) {
                const isCacheActual = moment_1.default
                    .utc(cacheRecord.dateCreated)
                    .add(cacheMSLife, 'milliseconds')
                    .isAfter((0, moment_1.default)().utc());
                if (isCacheActual) {
                    return;
                }
                cache = cache.filter((item) => item !== cacheRecord);
            }
            yield checkSession(device, token);
            cache.push({
                token,
                device,
                dateCreated: moment_1.default.utc().format()
            });
        }
    });
    const instance = {
        check
    };
    return instance;
};
exports.default = CachingAuthModule;
