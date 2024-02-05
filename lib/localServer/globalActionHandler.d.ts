import { AddActionParams, GlobalActionHandlerParams } from '../interfaces/interfaces';
export declare const addAction: (params: AddActionParams) => void;
export declare const globalActionHandler: (params: GlobalActionHandlerParams) => Promise<void>;
export declare const processResponse: (params: GlobalActionHandlerParams) => Promise<void>;
