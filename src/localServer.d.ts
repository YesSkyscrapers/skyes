export interface serverStartConfig {
    port: number
}


declare namespace localServer {
    function start(serverStartConfig: serverStartConfig): Promise<void>;
    function addAction(actionName: string, handler: Promise<void>, entityDefinition: any, method: string);
    function addAction(actionName: string, handler: Promise<void>, entityDefinition: any);
}

export default localServer;