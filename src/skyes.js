import entityManager from "./entityManager";
import localServer from "./localServer";
import logsManager from "./logsManager";

const DEFAULT_SKYES_CONFIG = {
}

const skyes = {
    init: () => { },
    addAction: () => { },
    addHandler: () => { },
}

skyes.init = async (config = {}) => {
    let skyesConfig = {
        ...DEFAULT_SKYES_CONFIG,
        ...config
    }
    try {
        logsManager.init(skyesConfig.logsConfig)
        await entityManager.init(skyesConfig.ormconfig)
        await localServer.start(skyesConfig.serverConfig)

    } catch (error) {
        console.log(`Skyes start failed. Error: ${error}`)
    }
}

skyes.addHandler = (handlerParams) => {
    localServer.addHandler(handlerParams)
}

skyes.addAction = (actionParams) => {
    localServer.addAction(actionParams)
}



export default skyes;