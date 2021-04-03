import { waitFor } from "skyes/src/tools"
import moment from 'moment'

let backgroundProcessesManager = {
    addbackgroundProcess: () => { },
    start: () => { },
    tick: () => { }
}

let isStarted = false

let storage = [];

const getNextTick = (time, config) => {
    return moment(time).add(config.incrementValue, config.incrementUnit).format()
}

backgroundProcessesManager.addbackgroundProcess = (processName, func, config) => {
    backgroundProcessesManager.start();

    let process = storage.find(process => process.name == processName);
    if (process) {
        process = {
            name: processName,
            func,
            config,
            nextTick: getNextTick(config.start, config)
        }
    } else {
        storage.push({
            name: processName,
            func,
            config,
            nextTick: getNextTick(config.start, config)
        })
    }
}

backgroundProcessesManager.tick = async () => {

    storage = storage.map(process => {
        if (moment().isAfter(moment(process.nextTick))) {
            process.func();

            return {
                ...process,
                nextTick: getNextTick(moment().format(), process.config)
            }
        } else {
            return process;
        }
    })

    await waitFor(1000)
    return backgroundProcessesManager.tick();
}

backgroundProcessesManager.start = () => {
    if (!isStarted) {
        isStarted = true;
        backgroundProcessesManager.tick()
    }
}

export default backgroundProcessesManager;