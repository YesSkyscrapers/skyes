const fs = require('fs')
const asyncFs = require('fs/promises')

const FILES_FOLDER = 'files/'

const fileManager = {
    init: () => { },
    saveFile: (response) => { }
}


fileManager.init = async (config) => {
    fileManager.saveFile()
}

const checkFolderExists = async () => {
    console.log(fs.existsSync(FILES_FOLDER))
}

fileManager.saveFile = async response => {
    await checkFolderExists();
}



export default fileManager;