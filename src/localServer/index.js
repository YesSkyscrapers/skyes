
import { addAction } from './globalActionHandler'
import { addHandler } from './globalHandler'
import server from './server'

let localServer = {
    start: server.start,
    stop: server.stop,
    addHandler: addHandler,
    addAction: addAction
}

export default localServer