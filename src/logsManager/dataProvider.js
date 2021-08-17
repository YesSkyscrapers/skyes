import fetch from 'node-fetch'

const DEFAULT_CONFIG = {
    logsUrl: null,
    identityUrl: null,
    serviceToken: "stub"
}

let config = {
    ...DEFAULT_CONFIG
}

const basicFetch = (...params) => {
    return fetch(...params).then(response => {
        return response.json().then(responseJson => {
            return responseJson
        })
    })
}


let dataProvider = {
    init: (_config) => {
        config = {
            ...DEFAULT_CONFIG,
            ..._config
        }
    },
    checkService: () => {
        return basicFetch(`${config.identityUrl}action`, {
            method: 'POST',
            body: JSON.stringify({
                action: "service.check",
                data: {
                    token: config.serviceToken
                }
            })
        })
    },
    createLog: (logs) => {
        return basicFetch(`${config.logsUrl}action`, {
            method: 'POST',
            body: JSON.stringify({
                action: "logs.create",
                data: {
                    token: config.serviceToken,
                    logs
                }
            })
        })
    }
}



export default dataProvider