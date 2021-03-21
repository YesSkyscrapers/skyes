import { entityManager } from "skyes";
import localServer from "./localServer";

const DEFAULT_SKYES_CONFIG = {}

const skyes = {
    init: () => { },
    addAction: () => { },
}

skyes.init = async (config = {}) => {
    let skyesConfig = {
        ...DEFAULT_SKYES_CONFIG,
        ...config
    }
    try {
        await entityManager.init();
        await localServer.start(skyesConfig.serverStartConfig)
    } catch (error) {
        console.log(`Skyes start failed. Error: ${error}`)
    }

}

skyes.addAction = (actionName, handler, entityDefinition, method) => {
    localServer.addAction(actionName, handler, entityDefinition, method)
}

export default skyes;