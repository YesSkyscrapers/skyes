export declare interface backgroundProcessConfig {
    incrementValue: number;
    incrementUnit: string;
    start: string;
}


declare namespace backgroundProcessesManager {
    function addbackgroundProcess(processName: string, func: () => void, config: backgroundProcessConfig);
}

export default backgroundProcessesManager;