import { AuthModuleInstance } from './types';
type InitAuthModuleProps = {
    checkSession: (device: string, token: string) => Promise<void>;
    cacheMSLife: number;
    headerParams?: {
        deviceKey?: string;
        tokenKey?: string;
    };
};
declare const CachingAuthModule: ({ checkSession, cacheMSLife, headerParams }: InitAuthModuleProps) => AuthModuleInstance;
export default CachingAuthModule;
