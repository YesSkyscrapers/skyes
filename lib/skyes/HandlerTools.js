"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const formidable = __importStar(require("formidable"));
const fs = __importStar(require("fs"));
const getTextBody = (request) => {
    return new Promise((resolve, reject) => {
        let rawBody = [];
        request.on('error', (error) => {
            reject(`Body fetching error: ${error}`);
        });
        request.on('data', (chunk) => {
            rawBody.push(chunk);
        });
        request.on('end', () => {
            resolve(Buffer.concat(rawBody).toString());
        });
    });
};
const getJsonBody = (request) => __awaiter(void 0, void 0, void 0, function* () {
    const text = yield getTextBody(request);
    return JSON.parse(text);
});
let parseRequestForm = (request) => {
    return new Promise((resolve, reject) => {
        let form = new formidable.IncomingForm();
        form.parse(request, (error, fields, file) => {
            if (error) {
                reject(error);
            }
            else {
                resolve({
                    fields,
                    file
                });
            }
        });
    });
};
const getFileFromRequest = (request, fileKey = 'fileupload') => __awaiter(void 0, void 0, void 0, function* () {
    let parsedForm = yield parseRequestForm(request);
    const selectedFile = parsedForm.file[fileKey];
    const fileForReturn = selectedFile
        ? Array.isArray(selectedFile)
            ? selectedFile[0]
            : selectedFile
        : null;
    if (fileForReturn) {
        return fileForReturn;
    }
    else {
        throw `Request not includes file "${fileKey}"`;
    }
});
const getFileFromRequestDirect = (request, filePath) => {
    return new Promise((resolve) => {
        const filestream = fs.createWriteStream(filePath, 'utf8');
        request.pipe(filestream);
        request.on('end', () => {
            resolve(null);
        });
    });
};
const pipeFileToResponse = (response, filepath) => {
    return new Promise((resolve, reject) => {
        fs.stat(filepath, (err, stats) => {
            if (err) {
                reject(err);
            }
            else {
                let filename = filepath;
                try {
                    let splittedPath = filepath.split('/');
                    filename = splittedPath[splittedPath.length - 1];
                }
                catch (err) { }
                response.setHeader('Content-disposition', `attachment; filename=${filename}`);
                response.setHeader('Content-Length', stats.size);
                const readStream = fs.createReadStream(filepath);
                readStream.pipe(response);
            }
        });
    });
};
const getHeaderValue = (request, key) => {
    const value = request.headers[key];
    return Array.isArray(value) ? value[0] : value;
};
exports.default = {
    getTextBody,
    getJsonBody,
    parseRequestForm,
    getFileFromRequest,
    pipeFileToResponse,
    getHeaderValue,
    getFileFromRequestDirect
};
