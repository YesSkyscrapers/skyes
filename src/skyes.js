import entityManager from "./entityManager";
import localServer from "./localServer";


class Config {
    constructor(props = {}) {
        this.ormconfig = props.ormconfig
        this.serverConfig = props.serverConfig
    }
}

class Skyes {
    constructor() {
        this.skyesConfig = new Config()
    }

    init = async (config = {}) => {

        this.skyesConfig = new Config(config)

        try {
            await entityManager.init(this.skyesConfig.ormconfig)
            await localServer.start(this.skyesConfig.serverConfig)
        } catch (error) {
            console.log(`Skyes start failed. Error: ${error}`)
        }
    }

    addHandler = (handlerParams) => {
        localServer.addHandler(handlerParams)
    }

    addAction = (actionParams) => {
        localServer.addAction(actionParams)
    }

    dispose = async () => {

        try {
            await entityManager.dispose()
            await localServer.stop()
        } catch (error) {
            console.log(`Skyes start failed. Error: ${error}`)
        }
    }
}

let skyes = new Skyes();

export default skyes