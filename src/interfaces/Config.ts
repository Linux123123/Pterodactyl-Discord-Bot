import { Message } from '../classes/Message';

export interface permCheck {
    (message: Message): boolean;
}

export interface permObject {
    level: number;
    name: string;
    check: permCheck;
}

export interface Config {
    ownerID: string;
    token: string;
    pteroToken: string;
    pteroHost: string;
    permLevels: permObject[];
}
