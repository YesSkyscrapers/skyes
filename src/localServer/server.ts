import { globalHandler } from './globalHandler'
import http, { Server as HttpServer, IncomingMessage, OutgoingMessage } from 'http'
import { argv } from 'process'
const moment = require('moment')

class Config {
    defaultHeaders: any
    defaultPort: number
    subUrl: string
    timeouts?: {
        keepAliveTimeout: number
        headersTimeout: number
    }

    constructor(props?: Config | undefined | null) {
        this.defaultHeaders = props?.defaultHeaders || {}
        this.defaultPort = props?.defaultPort || 3030
        this.subUrl = props?.subUrl || ''
        this.timeouts = props?.timeouts
    }
}

class Server {
    serverConfig: Config
    httpServer: HttpServer | null

    constructor() {
        this.serverConfig = new Config()
        this.httpServer = null
    }

    start = async (config: Config) => {
        try {
            this.serverConfig = new Config(config)

            let port: number = this.serverConfig.defaultPort

            argv.forEach((value) => {
                if (value.includes('-port:')) {
                    port = Number(value.split('-port:')[1])
                }
            })

            this.httpServer = http.createServer(globalHandler)
            if (this.serverConfig.timeouts) {
                this.httpServer.keepAliveTimeout = this.serverConfig.timeouts.keepAliveTimeout
                this.httpServer.headersTimeout = this.serverConfig.timeouts.headersTimeout
            }

            await new Promise((resolve, reject) => {
                this.httpServer!.listen(port, () => {
                    console.log(`${moment().format('DD.MM HH:mm:ss')}: Skyes started on port: ${port}`)
                    resolve(null)
                })
            })
        } catch (error) {
            throw `${moment().format('DD.MM HH:mm:ss')}: Server start failed with error: ${error}`
        }
    }

    stop = async () => {
        try {
            await new Promise((resolve, reject) => {
                this.httpServer!.close(() => {
                    console.log(`${moment().format('HH:mm:ss')}: Local server stopped`)
                    resolve(null)
                })
            })
        } catch (error) {
            throw `${moment().format('HH:mm:ss')}: Server stop failed with error: ${error}`
        }
    }

    getConfig = () => {
        return this.serverConfig
    }
}

let server = new Server()

export default server
export { Config, Server }
