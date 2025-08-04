import { IncomingMessage, OutgoingMessage } from 'http'
import * as formidable from 'formidable'
import * as fs from 'fs'

export interface ParsedForm {
    fields: formidable.Fields<string>
    file: formidable.Files<string>
}

const getTextBody = (request: IncomingMessage) => {
    return new Promise<string>((resolve, reject) => {
        let rawBody: Array<any> = []

        request.on('error', (error) => {
            reject(`Body fetching error: ${error}`)
        })
        request.on('data', (chunk) => {
            rawBody.push(chunk)
        })
        request.on('end', () => {
            resolve(Buffer.concat(rawBody).toString())
        })
    })
}

const getJsonBody = async (request: IncomingMessage) => {
    const text = await getTextBody(request)
    return JSON.parse(text)
}

let parseRequestForm = (request: IncomingMessage) => {
    return new Promise<ParsedForm>((resolve, reject) => {
        let form = new formidable.IncomingForm()
        form.parse(request, (error, fields, file) => {
            if (error) {
                reject(error)
            } else {
                resolve({
                    fields,
                    file
                })
            }
        })
    })
}

const getFileFromRequest = async (request: IncomingMessage, fileKey: string = 'fileupload') => {
    let parsedForm: ParsedForm = await parseRequestForm(request)
    const selectedFile = parsedForm.file[fileKey]
    const fileForReturn: formidable.File | null = selectedFile
        ? Array.isArray(selectedFile)
            ? selectedFile[0]
            : (selectedFile as formidable.File)
        : null

    if (fileForReturn) {
        return fileForReturn
    } else {
        throw `Request not includes file "${fileKey}"`
    }
}

const getFileFromRequestDirect = (request: IncomingMessage, filePath: string) => {
    return new Promise((resolve) => {
        const filestream = fs.createWriteStream(filePath, 'utf8')
        request.pipe(filestream)
        request.on('end', () => {
            resolve(null)
        })
    })
}

const pipeFileToResponse = (response: OutgoingMessage, filepath: string) => {
    return new Promise((resolve, reject) => {
        fs.stat(filepath, (err, stats) => {
            if (err) {
                reject(err)
            } else {
                let filename = filepath
                try {
                    let splittedPath = filepath.split('/')
                    filename = splittedPath[splittedPath.length - 1]
                } catch (err) {}

                response.setHeader('Content-disposition', `attachment; filename=${filename}`)
                response.setHeader('Content-Length', stats.size)

                const readStream = fs.createReadStream(filepath)
                readStream.pipe(response)
            }
        })
    })
}

const getHeaderValue = (request: IncomingMessage, key: string) => {
    const value = request.headers[key]
    return Array.isArray(value) ? value[0] : value
}

export default {
    getTextBody,
    getJsonBody,
    parseRequestForm,
    getFileFromRequest,
    pipeFileToResponse,
    getHeaderValue,
    getFileFromRequestDirect
}
