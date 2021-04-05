const fs = require('fs')
const asyncFs = require('fs/promises')
const mime = require('mime-types')
import { File } from 'skyes/src/entities/model/File';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment'
import { entityManager } from 'skyes';


const DEFAULT_FILES_FOLDER = 'files/'
let FILES_FOLDER = DEFAULT_FILES_FOLDER;

const fileManager = {
    init: () => { },
    saveFile: (response) => { }
}


fileManager.init = async (config) => {
    if (config && config.filesFolder) {
        FILES_FOLDER = config.filesFolder
    }
    try {
        checkFolderExists();
    } catch (error) {
        console.log("Files folder not exists, creating...")
        fs.mkdirSync(FILES_FOLDER)
    }
}

const checkFolderExists = () => {
    if (fs.existsSync(FILES_FOLDER)) {
        return true;
    } else {
        throw "Files folder doesnt exist"
    }
}

const getNewFileName = () => {
    const newName = uuidv4();

    while (fs.existsSync(`${FILES_FOLDER}${newName}`)) {
        return getNewFileName();
    }
    return newName
}

fileManager.saveFile = async response => {
    try {
        checkFolderExists()

        const newFileName = getNewFileName();
        const newFileType = (response && response.headers) ? response.headers.get("content-type") : null;
        const newFileExtension = newFileType ? `.${mime.extension(newFileType)}` : ''

        const newFilePath = `${FILES_FOLDER}${newFileName}${newFileExtension}`

        const fileStream = fs.createWriteStream(newFilePath);

        await new Promise((resolve, reject) => {
            response.body.pipe(fileStream);
            response.body.on("error", reject);
            fileStream.on("finish", resolve);
        });

        let file = new File();
        file.name = newFileName;
        file.filepath = newFilePath;
        file.date = moment().format();
        file.type = newFileType;

        const creationResult = await entityManager.create(File, file);
        return creationResult.entity;

    } catch (error) {
        throw `Save file error: ${error}`
    }
}



export default fileManager;