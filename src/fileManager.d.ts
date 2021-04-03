import { Response } from "node-fetch";
import { File } from './entities/model/File'

declare namespace fileManager {
    function init(): void;
    function saveFile(response: Response): Promise<File>
}

export default fileManager;