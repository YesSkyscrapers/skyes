export interface serverStartConfig {
    port: number,
    defaultHeaders: any
}


declare namespace localServer {
    function start(serverStartConfig: serverStartConfig): Promise<void>;
    function addAction(actionName: string, handler: Promise<void>, entityDefinition: any, method: string);
    function addAction(actionName: string, handler: Promise<void>, entityDefinition: any);
    function addPostAction(actionName: string, handler: Promise<void>, entityDefinition: any, method: string);
    function addPostAction(actionName: string, handler: Promise<void>, entityDefinition: any);
    function addHandler(url: string, handler: Promise<void>);
    function addHandler(url: string, handler: Promise<void>, useDefaultProcessing: Boolean);
    function stop(): Promise<void>;
}

export default localServer;