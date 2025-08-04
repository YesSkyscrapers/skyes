import EntityManager from './entityManager/EntityManager';
import { FilterTypes } from './entityManager/types';
export * from './skyes/types';
export * from './entityManager/types';
import HandlerTools, { ParsedForm } from './skyes/HandlerTools';
import Skyes from './skyes/Skyes';
declare const AuthModules: {
    AuthModule: ({ checkSession, headerParams }: {
        checkSession: (device: string, token: string) => Promise<void>;
        headerParams?: {
            deviceKey?: string | undefined;
            tokenKey?: string | undefined;
        } | undefined;
    }) => import("./skyes/authModule/types").AuthModuleInstance;
    CachingAuthModule: ({ checkSession, cacheMSLife, headerParams }: {
        checkSession: (device: string, token: string) => Promise<void>;
        cacheMSLife: number;
        headerParams?: {
            deviceKey?: string | undefined;
            tokenKey?: string | undefined;
        } | undefined;
    }) => import("./skyes/authModule/types").AuthModuleInstance;
};
export { EntityManager, FilterTypes, HandlerTools, ParsedForm, Skyes, AuthModules };
