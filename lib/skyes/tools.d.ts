/// <reference types="node" />
import { AssociatePathPatternResult } from './types';
import { OutgoingMessage } from 'http';
declare const subtractCustomPath: (url: string, customPath?: string) => string;
declare const getPathArray: (url: string) => string[];
declare const associatePathPattern: ({ url, pattern }: {
    url: string;
    pattern: string;
}) => AssociatePathPatternResult;
declare const fillResponseWithBasicHeaders: (response: OutgoingMessage, constHeaders?: {
    [key: string]: string;
}) => void;
export { getPathArray, associatePathPattern, subtractCustomPath, fillResponseWithBasicHeaders };
