import moment from 'moment'
import fetch from 'node-fetch'

let LOGS_LEVEL = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    FATAL: 4,
}

const valueOf = (object, value) => {
    return Object.keys(object).find(key => object[key] === value)
}

const LOGS_TYPE = {
    NONE: 'none',
    LOGGER: 'logger',
    CONSOLE: 'console',
}

const DEFAULT_LOGS_CONFIG = {
    type: LOGS_TYPE.CONSOLE,
    maxRamLimit: 1000,
    sendingTimeoutDelay: 10000,
    logsHandlerUrl: null,
    logsIdentityHandlerUrl: null,
    serviceName: 'logger',
    servicePassword: 'password'
}

let config = {
    ...DEFAULT_LOGS_CONFIG
}

let logsManager = {
    debug: () => { },
    info: () => { },
    warn: () => { },
    error: () => { },
    fatal: () => { },
    init: () => { },
}

logsManager.debug = (...args) => {
    return log(LOGS_LEVEL.DEBUG, ...args)
}

logsManager.info = (...args) => {
    return log(LOGS_LEVEL.INFO, ...args)
}

logsManager.warn = (...args) => {
    return log(LOGS_LEVEL.WARN, ...args)
}

logsManager.error = (...args) => {
    return log(LOGS_LEVEL.ERROR, ...args)
}

logsManager.fatal = (...args) => {
    return log(LOGS_LEVEL.FATAL, ...args)
}

const convertToLoggable = object => {
    if (Array.isArray(object)) {
        return `[${object.map(item => convertToLoggable(item)).join(', ')}]`
    } else {
        switch (typeof (object)) {
            case 'function': {
                return '[Func]'
            }
            case 'object': {
                return JSON.stringify(object)
            }
            case 'undefined': {
                return 'undefined'
            }
            default: {
                return `${object}`
            }
        }
    }
}

logsManager.init = (logsConfig) => {
    config = {
        ...DEFAULT_LOGS_CONFIG,
        ...logsConfig,
    }

    if (!config.logsHandlerUrl || !config.logsIdentityHandlerUrl) {
        config.type = LOGS_TYPE.CONSOLE
    }

    //dataProvider.init(config)

    //startSendingProcess()
}

const log = (level = LOGS_LEVEL.INFO, ...args) => {

    if (config.type == LOGS_TYPE.NONE) {
        return;
    }

    console.log(`[${valueOf(LOGS_LEVEL, level)}]`, ...args)

    if (config.type == LOGS_TYPE.LOGGER) {

        let message = args.map(item => convertToLoggable(item)).join(' ')

        sendLog(level, message)
    }
}

let storage = []

const sendLog = (level, message) => {

    let time = moment().format()

    storage.push({
        level,
        message,
        time
    })

    if (storage.length > config.maxRamLimit) {
        storage.shift()
    }

}


const startSendingProcess = () => {
    return sendingProcess()
}

const sendingProcess = async () => {
    let messagesForSend = [].concat(storage)
    let response = null
    try {
        //response = await dataProvider.sendLog(messagesForSend)
    } catch (error) {
    }

    if (response && response.ok) {
        storage = storage.slice(messagesForSend.length)
    }

    setTimeout(() => {
        sendingProcess()
    }, config.sendingTimeoutDelay)
}

export default logsManager