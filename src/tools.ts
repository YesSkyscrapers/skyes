const objectToParams = (object: any) => {
    Object.keys(object).forEach((key) => (object[key] === undefined ? delete object[key] : ''))
    let params: string = ''
    for (let key in object) {
        if (params != '') {
            params += '&'
        }
        params += key + '=' + encodeURIComponent(object[key])
    }
    return params
}

const paramsToObject = (params: string) => {
    try {
        return JSON.parse(
            '{"' + decodeURI(params).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}'
        )
    } catch (error) {
        return {}
    }
}

const waitFor = (delay: number) => {
    return new Promise((res) => {
        setTimeout(() => {
            return res(null)
        }, delay)
    })
}

export { objectToParams, paramsToObject, waitFor }
