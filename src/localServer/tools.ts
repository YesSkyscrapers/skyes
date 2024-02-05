import { IncomingMessage } from 'http'
import { paramsToObject } from '../tools'
import server from './server'
import {
    CheckUrlResult,
    Header,
    RequestObject,
    ResponseObject,
    TypeOfSplittedParsedObject
} from '../interfaces/interfaces'

const getRequestInfo = (httpRequest: IncomingMessage) => {
    return new Promise<RequestObject>((resolve, reject) => {
        const [_url, params, ...notUsed] = httpRequest.url!.split('?')

        let url = _url
        if (url.startsWith('/')) {
            url = url.slice(1)
        }
        if (url.endsWith('/')) {
            url = url.slice(0, -1)
        }

        let requestObject: RequestObject = {
            url: url,
            paramsObject: paramsToObject(params),
            method: httpRequest.method!,
            headers: [],
            body: {}
        }

        resolve(requestObject)
    })
}

const getRequestObject = (httpRequest: IncomingMessage) => {
    return new Promise<RequestObject>((resolve, reject) => {
        const [_url, params, ...notUsed] = httpRequest.url!.split('?')

        let url = _url
        if (url.startsWith('/')) {
            url = url.slice(1)
        }
        if (url.endsWith('/')) {
            url = url.slice(0, -1)
        }

        let requestObject: RequestObject = {
            url: url,
            paramsObject: paramsToObject(params),
            method: httpRequest.method!,
            body: {},
            headers: []
        }
        let rawBody: Array<any> = []

        Object.keys(httpRequest.headers).forEach((key) => {
            const value = httpRequest.headers[key]
            requestObject.headers.push({ key, value })
        })

        httpRequest.on('error', (error) => {
            reject(`Body fetching error: ${error}`)
        })
        httpRequest.on('data', (chunk) => {
            rawBody.push(chunk)
        })
        httpRequest.on('end', () => {
            try {
                try {
                    requestObject.body = JSON.parse(Buffer.concat(rawBody).toString())
                } catch (error) {
                    requestObject.body = {}
                }
                resolve(requestObject)
            } catch (error) {
                reject(`JSON parse error: ${error}`)
            }
        })
    })
}

let uniqueId = 0

const createResponseObject = (url: string) => {
    return new Promise<ResponseObject>((resolve, reject) => {
        const config = server.getConfig()

        let headers: Array<Header> = []
        headers.push({
            key: 'Content-Type',
            value: 'application/json'
        })
        if (config.defaultHeaders) {
            Object.keys(config.defaultHeaders).forEach((key) => {
                headers.push({
                    key: key,
                    value: config.defaultHeaders[key]
                })
            })
        }

        let responseObject: ResponseObject = {
            url: url,
            body: {},
            headers: headers,
            disableProcessing: false,
            requestId: uniqueId++
        }

        resolve(responseObject)
    })
}

const checkUrlPatterns = (handlerUrl: string, requestUrl: string) => {
    const config = server.getConfig()
    const subUrl = config.subUrl
    let _requestUrl = requestUrl.startsWith(subUrl) ? requestUrl.slice(subUrl.length) : requestUrl

    const splittedHandlerUrl = handlerUrl.split('/')
    const splittedRequestUrl = _requestUrl.split('/')
    if (splittedHandlerUrl.length != splittedRequestUrl.length) {
        const returnValue: CheckUrlResult = {
            result: false,
            params: {}
        }
        return returnValue
    } else {
        let result = true
        let params: TypeOfSplittedParsedObject = {}
        splittedHandlerUrl.forEach((handlerPart: string, index: number) => {
            if (handlerPart.startsWith('{') && handlerPart.endsWith('}')) {
                params[handlerPart.slice(1, -1)] = splittedRequestUrl[index]
            } else {
                if (handlerPart != splittedRequestUrl[index]) {
                    result = false
                }
            }
        })
        const returnValue: CheckUrlResult = { result, params }
        return returnValue
    }
}

export { createResponseObject, getRequestObject, checkUrlPatterns, getRequestInfo }
