declare class LocalServer {
    constructor();
    start: (config: import("./server").Config) => Promise<void>;
    stop: () => Promise<void>;
    addHandler: (params: import("../interfaces/interfaces").AddHandlerParams) => void;
    addAction: (params: import("../interfaces/interfaces").AddActionParams) => void;
}
declare let localServer: LocalServer;
export default localServer;
