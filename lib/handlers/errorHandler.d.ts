import { Config, ErrorHandlerParams } from '../interfaces/interfaces';
declare const errorHandler: (config: Config) => (params: ErrorHandlerParams) => Promise<void>;
export { errorHandler };
