import { Config, HandlerParams } from '../interfaces/interfaces';
declare const handler: (config: Config) => (params: HandlerParams) => Promise<void>;
export default handler;
