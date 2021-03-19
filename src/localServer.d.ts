export interface serverStartConfig {
    port: number
}


declare namespace localServer {
    function start(serverStartConfig: serverStartConfig): Promise<void>;
}

export default localServer;