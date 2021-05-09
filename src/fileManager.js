const fs = require('fs')
const asyncFs = require('fs/promises')
const mime = require('mime-types')
import { File } from 'skyes/src/entities/model/File';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment'
import { entityManager } from 'skyes';


const DEFAULT_FILES_FOLDER = 'files/'
let FILES_FOLDER = DEFAULT_FILES_FOLDER;
const DEFAULT_FILES_MAX_SIZE = 1024 * 1024 * 1024
let FILES_MAX_SIZE = DEFAULT_FILES_MAX_SIZE;

const fileManager = {
    init: () => { },
    saveFile: (response) => { }
}


fileManager.init = async (config) => {
    if (config && config.filesFolder) {
        FILES_FOLDER = config.filesFolder
    }
    if (config && config.filexMaxSize) {
        FILES_MAX_SIZE = config.filexMaxSize
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

const checkMaxFilesSize = () => {
    return new Promise(async (resolve, reject) => {
        const { sum } = await (await entityManager.getRepository(File))
            .createQueryBuilder("file")
            .select("SUM(file.fileSize)", "sum")
            .getRawOne();


        if (sum > FILES_MAX_SIZE) {
            let firstElement = (await entityManager.read(File, 1, 0, [{
                type: "equal",
                key: "deleted",
                value: false
            }])).data[0]
            firstElement.deleted = true
            firstElement.fileSize = 0

            fs.rm(firstElement.filepath, async () => {
                await entityManager.update(File, firstElement)
                resolve();
            })

        }

    }).catch(error => {
        console.log(`Check files max size error: ${error}`)
    })
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
        file.fileSize = fs.statSync(newFilePath).size;
        file.date = moment().format();
        file.type = newFileType;

        const creationResult = await entityManager.create(File, file);

        checkMaxFilesSize()

        return creationResult.entity;

    } catch (error) {
        throw `Save file error: ${error}`
    }
}

fileManager.saveBuffer = async (buffer, type) => {
    try {
        checkFolderExists()

        const newFileName = getNewFileName();
        const newFileType = type
        const newFileExtension = newFileType ? `.${mime.extension(newFileType)}` : ''

        const newFilePath = `${FILES_FOLDER}${newFileName}${newFileExtension}`


        await fs.promises.writeFile(newFilePath, buffer)

        let file = new File();
        file.name = newFileName;
        file.filepath = newFilePath;
        file.fileSize = fs.statSync(newFilePath).size;
        file.date = moment().format();
        file.type = newFileType;

        const creationResult = await entityManager.create(File, file);

        checkMaxFilesSize()

        return creationResult.entity;

    } catch (error) {
        throw `Save file error: ${error}`
    }
}

fileManager.writeFileToResponse = async (response, fileId) => {
    const readResult = await entityManager.read(File, 1, 0, [{
        type: "equal",
        key: "id",
        value: fileId
    }])


    if (readResult.data.length == 0) {
        throw `File record not found`
    } else {
        const fileRecord = readResult.data[0]
        if (fileRecord.deleted) {
            throw `File deleted`
        } else {

            try {
                const fileInfo = fs.statSync(fileRecord.filepath);

                response.writeHead(200, {
                    'Content-Type': fileRecord.type,
                    'Content-Length': fileInfo.size
                });

                var readStream = fs.createReadStream(fileRecord.filepath);
                readStream.pipe(response);
            } catch (_error) {
                const error = `FileManager writeFileToResponse error: ${_error}`
                throw error;
            }
        }
    }

}



export default fileManager;