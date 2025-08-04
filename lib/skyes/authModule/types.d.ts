/// <reference types="node" />
import { IncomingMessage } from 'http';
type AuthModuleInstance = {
    check: (request: IncomingMessage) => Promise<void>;
};
export { AuthModuleInstance };
