const EntitySchema = require("typeorm").EntitySchema;
const File = require("../model/File").File;

module.exports = new EntitySchema({
    name: "File",
    target: File,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "varchar"
        },
        filepath: {
            type: "varchar"
        },
        date: {
            type: "varchar"
        },
        type: {
            type: "varchar"
        },
        fileSize: {
            type: "int"
        },
        deleted: {
            default: false,
            type: "boolean"
        }
    }
});