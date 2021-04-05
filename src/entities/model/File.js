class File {
    constructor(id, name, filepath, date, type) {
        this.id = id;
        this.name = name;
        this.filepath = filepath;
        this.date = date;
        this.type = type;
    }
}

module.exports = {
    File: File
};