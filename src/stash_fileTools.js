const fs = require('fs')
const asyncFs = require('fs/promises')
const mime = require('mime-types')
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment'
import { entityManager } from 'skyes';

const fileTools = {
    saveFile: (response) => { }
}



fileTools.saveFile = async response => {
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

fileTools.saveBuffer = async (buffer, type) => {
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

fileTools.writeFileToResponse = async (response, fileId) => {
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
                const error = `fileTools writeFileToResponse error: ${_error}`
                throw error;
            }
        }
    }

}



export default fileTools;