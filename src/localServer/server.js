
import { globalHandler } from './globalHandler';
import http from 'http'
import { argv } from 'process';

class Config {
    constructor(props = {}) {
        this.defaultHeaders = props.defaultHeaders || {}
        this.defaultPort = props.defaultPort || 3030
        this.subUrl = props.subUrl || ""
    }
}

class Server {
    constructor() {
        this.serverConfig = new Config();
        this.httpServer = null;
    }

    start = async (config) => {
        try {
            this.serverConfig = new Config(config)

            let port = this.serverConfig.defaultPort

            argv.forEach(value => {
                if (value.includes("-port:")) {
                    port = value.split("-port:")[1]
                }
            })

            this.httpServer = http.createServer(globalHandler)
            await new Promise((resolve, reject) => {
                this.httpServer.listen(port, error => {
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

    stop = async () => {
        try {
            await new Promise((resolve, reject) => {
                this.httpServer.close(() => {
                    console.log('Local server stopped')
                    resolve();
                })
            })
        } catch (error) {
            throw `Server stop failed with error: ${error}`
        }
    }

    getConfig = () => {
        return this.serverConfig;
    }
}

let server = new Server();

export default server;