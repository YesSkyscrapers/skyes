
import { addAction } from './globalActionHandler'
import { addHandler } from './globalHandler'
import server from './server'

class LocalServer {
    constructor(){

    }

    start = server.start
    stop = server.stop
    addHandler = addHandler
    addAction = addAction
}

let localServer = new LocalServer();


export default localServer