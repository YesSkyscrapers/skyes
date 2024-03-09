import entityManager from './entityManager'
import { AddActionParams, AddHandlerParams, GlobalConfig } from './interfaces/interfaces'
import localServer from './localServer'
import { Config } from './localServer/server'

class Skyes {
    skyesConfig: GlobalConfig | undefined

    init = async (config: GlobalConfig) => {
        this.skyesConfig = config

        try {
            if (this.skyesConfig!.ormconfig) {
                await entityManager.init(this.skyesConfig!.ormconfig)
            }
            if (this.skyesConfig!.serverConfig) {
                await localServer.start(this.skyesConfig!.serverConfig)
            }
        } catch (error) {
            console.log(`Skyes start failed. Error: ${error}`)
        }
    }

    addHandler = (handlerParams: AddHandlerParams) => {
        localServer.addHandler(handlerParams)
    }

    addAction = (actionParams: AddActionParams) => {
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

let skyes = new Skyes()

export default skyes
