
import { paramsToObject } from 'skyes/src/tools'
import { DEFAULT_SERVER_CONFIG } from './constants';
import { globalHandler } from './globalHandler';
import logsManager from '../logsManager';
import http from 'http'

let server = {
    start: () => { },
    stop: () => { }
}

let serverConfig = null;
let httpServer = null;


server.start = async (config = {}) => {
    try {
        serverConfig = {
            ...DEFAULT_SERVER_CONFIG,
            ...config
        }
        httpServer = http.createServer(globalHandler)
        await new Promise((resolve, reject) => {
            httpServer.listen(serverConfig.port, error => {
                if (error) {
                    reject(`HttpServer listen error: ${error}`)
                } else {
                    logsManager.info(`Skyes started on port: ${serverConfig.port}`)
                    resolve();
                }
            })
        })
    } catch (error) {
        throw `Server start failed with error: ${error}`
    }
}

server.stop = async () => {
    try {
        await new Promise((resolve, reject) => {
            httpServer.close(() => {
                logsManager.info('Local server stopped')
                resolve();
            })
        })
    } catch (error) {
        throw `Server stop failed with error: ${error}`
    }
}





export default server;