import { Header } from "skyes/src/definitions/header";


export interface Response {
    body: object;
    headers: Array<Header>
}