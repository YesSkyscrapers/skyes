import { serverStartConfig } from "skyes/src/localServer";

declare interface skyesConfig {
    serverStartConfig: serverStartConfig;
}


declare namespace skyes {
    function init(skyesConfig: skyesConfig): Promise<void>;
    function init(): Promise<void>;
    function addAction(actionName: string, handler: Promise<void>, entityDefinition: any, method: string);
    function addAction(actionName: string, handler: Promise<void>, entityDefinition: any);
}

export default skyes;