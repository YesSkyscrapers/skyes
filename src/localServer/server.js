
import { paramsToObject } from 'skyes/src/tools'
import { DEFAULT_SERVER_CONFIG } from './constants';
import { globalHandler } from './globalHandler';
import http from 'http'
import { argv } from 'process';

let server = {
    start: () => { },
    stop: () => { },
    getConfig: () => ({})
}

let serverConfig = null;
let httpServer = null;

server.getConfig = () => {
    return serverConfig
}

server.start = async (config = {}) => {
    try {
        serverConfig = {
            ...DEFAULT_SERVER_CONFIG,
            ...config
        }


        let port = serverConfig.defaultPort

        argv.forEach(value => {
            if (value.includes("-port:")) {
                port = value.split("-port:")[1]
            }
        })

        httpServer = http.createServer(globalHandler)
        await new Promise((resolve, reject) => {
            httpServer.listen(port, error => {
                if (error) {
                    reject(`HttpServer listen error: ${error}`)
                } else {
                    console.log(`Skyes started on port: ${port}`)
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
                console.log('Local server stopped')
                resolve();
            })
        })
    } catch (error) {
        throw `Server stop failed with error: ${error}`
    }
}





export default server;