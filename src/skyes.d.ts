import { serverStartConfig } from "skyes/src/localServer";
import { backgroundProcessConfig } from "skyes/src/backgroundProcessesManager";
import { fileConfig } from "skyes/src/fileManager";
import { Request } from "skyes/src/definitions/request";
import { Response } from "skyes/src/definitions/response";

declare interface skyesConfig {
    serverStartConfig: serverStartConfig | null;
    ormconfig: any,
    filesConfig: fileConfig
}


declare namespace skyes {
    function init(skyesConfig: skyesConfig): Promise<void>;
    function init(): Promise<void>;
    function dispose(): Promise<void>;
    function addAction(actionName: string, handler: (request: Request, response: Response) => ((entityDefinition: any) => Promise<void>), entityDefinition: any, method: string);
    function addAction(actionName: string, handler: (request: Request, response: Response) => ((entityDefinition: any) => Promise<void>), entityDefinition: any);
    function addPostAction(actionName: string, handler: (request: Request, response: Response) => ((entityDefinition: any) => Promise<void>), entityDefinition: any, method: string);
    function addPostAction(actionName: string, handler: (request: Request, response: Response) => ((entityDefinition: any) => Promise<void>), entityDefinition: any);
    function addHandler(url: string, handler: (request: Request, response: Response) => Promise<void>);
    function addbackgroundProcess(processName: string, func: () => void, config: backgroundProcessConfig);
}

export default skyes;