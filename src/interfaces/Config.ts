import { Message } from '../message/Message';

export interface permCheck {
    (message: Message): boolean | undefined;
}

export interface permObject {
    level: number;
    name: string;
    check: permCheck;
}

export default interface Config {
    ownerID: string;
    admins: string[];
    support: string[];
    token: string;
    pteroToken: string;
    pteroHost: string;
    permLevels: permObject[];
}
