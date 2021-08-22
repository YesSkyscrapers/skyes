import moment from 'moment'
import fetch from 'node-fetch'
import dataProvider from './dataProvider'

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

export const LOGS_TYPE = {
    NONE: 'none',
    LOGGER: 'logger',
    CONSOLE: 'console',
}

export const LOGS_OBJECTS_TYPES = {
    LOGS: 'LOGS',
    HANDLERS: 'HANDLERS',
    ACTIONS: 'ACTIONS',
}

export const ACTION_LOGS_OBJECTS_TYPES = {
    REQUEST: 'REQUEST',
    RESPONSE: 'RESPONSE',
}

const DEFAULT_LOGS_CONFIG = {
    type: LOGS_TYPE.CONSOLE,
    maxRamLimit: 1000,
    sendingTimeoutDelay: 10000,
    logsUrl: null,
    identityUrl: null,
    serviceToken: 'stub',
    selfLogging: false
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
    logHandlerRequest: () => { },
    logActionRequest: () => { },
    logActionResponse: () => { },
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

    if (!config.logsUrl || !config.identityUrl) {
        config.type = LOGS_TYPE.CONSOLE
    }


    if (config.type == LOGS_TYPE.LOGGER) {
        startSendingProcess(config)
    }
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
        logLevel: level,
        log: message,
        time,
        type: LOGS_OBJECTS_TYPES.LOGS
    })

    if (storage.length > config.maxRamLimit) {
        storage.shift()
    }

}


const startSendingProcess = (config) => {
    dataProvider.init(config)

    setTimeout(() => {
        sendingProcess()
    }, config.sendingTimeoutDelay)
}

const sendingProcess = async () => {
    let messagesForSend = [].concat(storage)
    let response = null

    if (messagesForSend.length > 0) {
        try {
            let serviceInfo = await dataProvider.checkService()

            if (serviceInfo.service) {
                response = await dataProvider.createLog(messagesForSend)
            } else {
                logsManager.error("Logging stopped. Console logs still active.")
                return;
            }
        } catch (error) {
            console.log(error)
            console.log(messagesForSend)
            logsManager.info(error.message)
        }

        if (response && response.logs) {
            storage = storage.slice(messagesForSend.length)
        } else if (response) {
            if (response.errorMessage) {
                logsManager.error(response.errorMessage)
            } else {
                logsManager.error("Unknown logs response")
            }
        }
    }


    setTimeout(() => {
        sendingProcess()
    }, config.sendingTimeoutDelay)
}

logsManager.logHandlerRequest = (httpRequest, response) => {

    let time = moment().format()

    storage.push({
        url: httpRequest.url,
        requestId: `${response.requestId}`,
        method: httpRequest.method,
        headers: JSON.stringify(httpRequest.headers),
        time,
        type: LOGS_OBJECTS_TYPES.HANDLERS
    })
}

logsManager.logActionRequest = (httpRequest, request, response) => {

    let time = moment().format()

    storage.push({
        url: request.url,
        actionName: request.body.action,
        actionType: ACTION_LOGS_OBJECTS_TYPES.REQUEST,
        body: JSON.stringify(request.body),
        requestId: `${response.requestId}`,
        time,
        type: LOGS_OBJECTS_TYPES.ACTIONS
    })
}

logsManager.logActionResponse = (response, request) => {
    let time = moment().format()

    let body = JSON.stringify(response.body);
    if (config.selfLogging) {
        body = `cropped: ${body.slice(0, 100)}`
    }
    storage.push({
        url: request.url,
        actionName: request.body.action,
        actionType: ACTION_LOGS_OBJECTS_TYPES.RESPONSE,
        body: body,
        isError: !!(body.errorMessage),
        requestId: `${response.requestId}`,
        headers: JSON.stringify(response.headers),
        time,
        type: LOGS_OBJECTS_TYPES.ACTIONS
    })
}

export default logsManager