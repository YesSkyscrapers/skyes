declare const objectToParams: (object: any) => string;
declare const paramsToObject: (params: string) => any;
declare const waitFor: (delay: number) => Promise<unknown>;
export { objectToParams, paramsToObject, waitFor };
