import { AddActionParams, AddHandlerParams, GlobalConfig } from './interfaces/interfaces';
declare class Skyes {
    skyesConfig: GlobalConfig | undefined;
    init: (config: GlobalConfig) => Promise<void>;
    addHandler: (handlerParams: AddHandlerParams) => void;
    addAction: (actionParams: AddActionParams) => void;
    dispose: () => Promise<void>;
}
declare let skyes: Skyes;
export default skyes;
