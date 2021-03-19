import { Header } from "skyes/src/definitions/header";


export interface Request {
    url: string;
    body: object;
    headers: Array<Header>
}