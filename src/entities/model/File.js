class File {
    constructor(id, name, filepath, date, type, deleted) {
        this.id = id;
        this.name = name;
        this.filepath = filepath;
        this.date = date;
        this.type = type;
        this.deleted = deleted;
        this.fileSize = 0;
    }
}

module.exports = {
    File: File
};