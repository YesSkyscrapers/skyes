import { Response } from "node-fetch";
import { File } from './entities/model/File'

export interface fileConfig {
    filesFolder: string
}

declare namespace fileManager {
    function init(): void;
    function init(config: fileConfig): void;
    function saveFile(response: Response): Promise<File>
}

export default fileManager;