import { AddActionParams } from "./localServer/globalActionHandler";
import { AddHandlerParams } from "./localServer/globalHandler";

export default skyes;
declare let skyes: Skyes;
export declare class Skyes {
    skyesConfig: Config;
    init: (config?: any) => Promise<void>;
    addHandler: (handlerParams: AddHandlerParams) => void;
    addAction: (actionParams: AddActionParams) => void;
    dispose: () => Promise<void>;
}
declare class Config {
    constructor(props: any);
    ormconfig: any;
    serverConfig: any;
}
