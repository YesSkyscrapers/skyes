import { IncomingMessage } from 'http'
import { AuthModuleInstance } from './types'
import HandlerTools from '../HandlerTools'

type InitAuthModuleProps = {
    checkSession: (device: string, token: string) => Promise<void>
    headerParams?: {
        deviceKey?: string
        tokenKey?: string
    }
}

const AuthModule = ({ checkSession, headerParams }: InitAuthModuleProps) => {
    const check = async (request: IncomingMessage) => {
        const device = HandlerTools.getHeaderValue(request, headerParams?.deviceKey || 'device')
        const token = HandlerTools.getHeaderValue(request, headerParams?.tokenKey || 'token')

        if (!device || !token) {
            throw 'Wrong auth headers'
        } else {
            await checkSession(device, token)
        }
    }

    const instance: AuthModuleInstance = {
        check
    }

    return instance
}

export default AuthModule
