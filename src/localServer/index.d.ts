import { AddActionParams } from "./globalActionHandler";
import { AddHandlerParams } from "./globalHandler";
import { Config } from "./server";

export default localServer;
declare let localServer: LocalServer;
declare class LocalServer {
    start: (config: Config) => Promise<void>;
    stop: () => Promise<void>;
    addHandler: (params: AddHandlerParams) => void;
    addAction: (params: AddActionParams) => void;
}



