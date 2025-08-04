import { DEFAULT_HEADERS } from '../constants'
import { AssociatePathPatternResult } from './types'
import { OutgoingMessage } from 'http'

const subtractCustomPath = (url: string, customPath: string = '/') => {
    const urlAvoidingDash = url.slice(url.startsWith('/') ? 1 : 0)
    const lowerUrlAvoidingDash = urlAvoidingDash.toLowerCase()
    return lowerUrlAvoidingDash.startsWith(customPath)
        ? lowerUrlAvoidingDash.slice(customPath.length)
        : lowerUrlAvoidingDash
}

const getPathArray = (url: string) => {
    const splitted = url.split('/')
    return splitted.filter((part) => part.length > 0)
}

const associatePathPattern = ({ url, pattern }: { url: string; pattern: string }): AssociatePathPatternResult => {
    const urlPathArray = getPathArray(url)
    const patternPathArray = getPathArray(pattern)

    if (urlPathArray.length == patternPathArray.length) {
        let result: AssociatePathPatternResult = {
            isSame: true,
            params: {}
        }

        for (let [patternPathIndex, patternPathPart] of patternPathArray.entries()) {
            const isPartVariable = patternPathPart.startsWith('{') && patternPathPart.endsWith('}')
            if (isPartVariable) {
                result.params![patternPathPart.slice(1, -1)] = urlPathArray[patternPathIndex]
            } else {
                if (patternPathPart !== urlPathArray[patternPathIndex]) {
                    result.isSame = false
                    break
                }
            }
        }

        return result
    } else {
        return {
            isSame: false
        }
    }
}

const fillResponseWithBasicHeaders = (response: OutgoingMessage, constHeaders: { [key: string]: string } = {}) => {
    Object.entries({ ...DEFAULT_HEADERS, ...constHeaders }).forEach(([key, value]) => {
        response.setHeader(key, value)
    })
}

export { getPathArray, associatePathPattern, subtractCustomPath, fillResponseWithBasicHeaders }
