import { Response as HttpResponse } from 'node-fetch';
import { Request } from 'skyes/src/definitions/request';
import { Response } from 'skyes/src/definitions/response';


export declare function handler(request: Request, response: Response):
    (Promise<void>);