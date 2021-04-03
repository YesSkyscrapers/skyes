import { serverStartConfig } from "skyes/src/localServer";
import { backgroundProcessConfig } from "skyes/src/backgroundProcessesManager";

declare interface skyesConfig {
    serverStartConfig: serverStartConfig | null;
    ormconfig: any
}


declare namespace skyes {
    function init(skyesConfig: skyesConfig): Promise<void>;
    function init(): Promise<void>;
    function addAction(actionName: string, handler: Promise<void>, entityDefinition: any, method: string);
    function addAction(actionName: string, handler: Promise<void>, entityDefinition: any);
    function addbackgroundProcess(processName: string, func: () => void, config: backgroundProcessConfig);
}

export default skyes;