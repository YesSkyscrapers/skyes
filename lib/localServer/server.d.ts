/// <reference types="node" />
import { Server as HttpServer } from 'http';
declare class Config {
    defaultHeaders: any;
    defaultPort: number;
    subUrl: string;
    constructor(props?: Config | undefined | null);
}
declare class Server {
    serverConfig: Config;
    httpServer: HttpServer | null;
    constructor();
    start: (config: Config) => Promise<void>;
    stop: () => Promise<void>;
    getConfig: () => Config;
}
declare let server: Server;
export default server;
export { Config, Server };
