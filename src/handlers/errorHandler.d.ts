import { IncomingMessage, ServerResponse } from 'http'
import { Request } from 'skyes/src/definitions/request';
import { Response } from 'skyes/src/definitions/response';


export declare function handler(request: Request, response: Response):
    ((error: string) => void);