import { Config, HandlerParams } from '../interfaces/interfaces';
declare const handler: (config: Config, dispose: () => Promise<void>) => (params: HandlerParams) => Promise<void>;
export default handler;
