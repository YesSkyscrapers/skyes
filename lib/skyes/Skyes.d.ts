import { Action, Handler, InitSkyesParams } from './types';
declare const Skyes: (initParams: InitSkyesParams) => {
    start: () => Promise<unknown>;
    stop: () => Promise<unknown>;
    addAction: <T, U>({ name, handle, verifyAuth }: Action<T, U>) => void;
    addHandler: ({ path, method, handle, verifyAuth }: Handler) => void;
};
export default Skyes;
