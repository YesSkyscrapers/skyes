import { AuthModuleInstance } from './types';
type InitAuthModuleProps = {
    checkSession: (device: string, token: string) => Promise<void>;
    headerParams?: {
        deviceKey?: string;
        tokenKey?: string;
    };
};
declare const AuthModule: ({ checkSession, headerParams }: InitAuthModuleProps) => AuthModuleInstance;
export default AuthModule;
