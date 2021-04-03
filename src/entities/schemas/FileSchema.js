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
        filename: {
            type: "varchar"
        },
        date: {
            type: "varchar"
        },
        type: {
            type: "varchar"
        }
    }
});