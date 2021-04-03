import { entityManager } from "skyes";
import backgroundProcessesManager from "skyes/src/backgroundProcessesManager";
import fileManager from "skyes/src/fileManager";
import localServer from "./localServer";

const DEFAULT_SKYES_CONFIG = {}

const skyes = {
    init: () => { },
    addAction: () => { },
    addbackgroundProcess: () => { },
}

skyes.init = async (config = {}) => {
    let skyesConfig = {
        ...DEFAULT_SKYES_CONFIG,
        ...config
    }
    try {
        await fileManager.init();
        //await entityManager.init(skyesConfig.ormconfig);
        //await localServer.start(skyesConfig.serverStartConfig)

    } catch (error) {
        console.log(`Skyes start failed. Error: ${error}`)
    }

}

skyes.addAction = (actionName, handler, entityDefinition, method) => {
    localServer.addAction(actionName, handler, entityDefinition, method)
}

skyes.addbackgroundProcess = (processName, func, config) => {
    backgroundProcessesManager.addbackgroundProcess(processName, func, config)
}

export default skyes;