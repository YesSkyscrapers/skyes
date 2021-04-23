import { entityManager } from "skyes";
import backgroundProcessesManager from "skyes/src/backgroundProcessesManager";
import fileManager from "skyes/src/fileManager";
import localServer from "./localServer";

const DEFAULT_SKYES_CONFIG = {
}

const skyes = {
    init: () => { },
    addAction: () => { },
    addPostAction: () => { },
    addbackgroundProcess: () => { },
}

skyes.init = async (config = {}) => {
    let skyesConfig = {
        ...DEFAULT_SKYES_CONFIG,
        ...config
    }
    try {
        await entityManager.init(skyesConfig.ormconfig);
        await fileManager.init(skyesConfig.filesConfig);
        await localServer.start(skyesConfig.serverStartConfig)

    } catch (error) {
        console.log(`Skyes start failed. Error: ${error}`)
    }

}

skyes.dispose = async () => {
    try {
        await localServer.stop();
        await entityManager.dispose();
        process.exit(0)
        //filemanager doesnt need be dispose
    } catch (error) {
        const _error = `Skyes dispose failed. Error: ${error}`
        console.log(_error)
        throw _error
    }

}

skyes.addAction = (actionName, handler, entityDefinition, method) => {
    localServer.addAction(actionName, handler, entityDefinition, method)
}

skyes.addPostAction = (actionName, handler, entityDefinition, method) => {
    localServer.addPostAction(actionName, handler, entityDefinition, method)
}

skyes.addHandler = (url, handler, useDefaultProcessing = true) => {
    localServer.addHandler(url, handler, useDefaultProcessing)
}

skyes.addbackgroundProcess = (processName, func, config) => {
    backgroundProcessesManager.addbackgroundProcess(processName, func, config)
}

export default skyes;