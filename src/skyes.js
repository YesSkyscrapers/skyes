import entityManager from "./entityManager";
import localServer from "./localServer";

const DEFAULT_SKYES_CONFIG = {
}

const skyes = {
    init: () => { },
    addAction: () => { },
    addHandler: () => { },
    dispose: () => { }
}

skyes.init = async (config = {}) => {
    let skyesConfig = {
        ...DEFAULT_SKYES_CONFIG,
        ...config
    }
    try {
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

skyes.dispose = async () => {

    try {
        await entityManager.dispose()
        await localServer.stop()

    } catch (error) {
        console.log(`Skyes start failed. Error: ${error}`)
    }
}


export default skyes;