class File {
    constructor(id, name, filename, date, type) {
        this.id = id;
        this.name = name;
        this.filename = filename;
        this.date = date;
        this.type = type;
    }
}

module.exports = {
    File: File
};