import { IncomingMessage } from 'http'
import { AuthModuleInstance } from './types'

const DisabledAuthModule = () => {
    const check = async (request: IncomingMessage) => {}

    const instance: AuthModuleInstance = {
        check
    }

    return instance
}

export default DisabledAuthModule
