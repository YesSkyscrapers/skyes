import { Server as HttpServer } from 'http'

export default server;
declare let server: Server;
declare class Server {
    serverConfig: Config;
    httpServer: HttpServer;
    start: (config: Config) => Promise<void>;
    stop: () => Promise<void>;
    getConfig: () => Config;
}

export declare interface Config {
    defaultHeaders: any;
    defaultPort: number;
    subUrl: string;
}

