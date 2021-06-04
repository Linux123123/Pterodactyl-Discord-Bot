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
    token: string;
    pteroToken: string;
    pteroClientToken: string;
    pteroHost: string;
    permLevels: permObject[];
}
