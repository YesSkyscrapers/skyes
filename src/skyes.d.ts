import { serverStartConfig } from "skyes/src/localServer";

declare interface skyesConfig {
    serverStartConfig: serverStartConfig;
}


declare namespace skyes {
    function init(skyesConfig: skyesConfig): Promise<void>;
    function init(): Promise<void>;
}

export default skyes;