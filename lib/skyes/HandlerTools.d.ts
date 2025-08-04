/// <reference types="node" />
import { IncomingMessage, OutgoingMessage } from 'http';
import * as formidable from 'formidable';
export interface ParsedForm {
    fields: formidable.Fields<string>;
    file: formidable.Files<string>;
}
declare const _default: {
    getTextBody: (request: IncomingMessage) => Promise<string>;
    getJsonBody: (request: IncomingMessage) => Promise<any>;
    parseRequestForm: (request: IncomingMessage) => Promise<ParsedForm>;
    getFileFromRequest: (request: IncomingMessage, fileKey?: string) => Promise<formidable.File>;
    pipeFileToResponse: (response: OutgoingMessage<IncomingMessage>, filepath: string) => Promise<unknown>;
    getHeaderValue: (request: IncomingMessage, key: string) => string | undefined;
    getFileFromRequestDirect: (request: IncomingMessage, filePath: string) => Promise<unknown>;
};
export default _default;
