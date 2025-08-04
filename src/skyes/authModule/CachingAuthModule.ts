import { IncomingMessage } from 'http'
import { AuthModuleInstance } from './types'
import moment from 'moment'
import HandlerTools from '../HandlerTools'

type InitAuthModuleProps = {
    checkSession: (device: string, token: string) => Promise<void>
    cacheMSLife: number
    headerParams?: {
        deviceKey?: string
        tokenKey?: string
    }
}

type CacheItem = {
    device: string
    token: string
    dateCreated: string
}

const CachingAuthModule = ({ checkSession, cacheMSLife = 1000, headerParams }: InitAuthModuleProps) => {
    let cache: CacheItem[] = []

    const check = async (request: IncomingMessage) => {
        const device = HandlerTools.getHeaderValue(request, headerParams?.deviceKey || 'device')
        const token = HandlerTools.getHeaderValue(request, headerParams?.tokenKey || 'token')

        if (!device || !token) {
            throw 'Wrong auth headers'
        } else {
            const cacheRecord = cache.find((item) => item.token === token && item.device === device)

            if (cacheRecord) {
                const isCacheActual = moment
                    .utc(cacheRecord.dateCreated)
                    .add(cacheMSLife, 'milliseconds')
                    .isAfter(moment().utc())

                if (isCacheActual) {
                    return
                }
                cache = cache.filter((item) => item !== cacheRecord)
            }
            await checkSession(device, token)

            cache.push({
                token,
                device,
                dateCreated: moment.utc().format()
            })
        }
    }

    const instance: AuthModuleInstance = {
        check
    }

    return instance
}

export default CachingAuthModule
