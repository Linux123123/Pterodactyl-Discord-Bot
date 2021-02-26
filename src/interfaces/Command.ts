import { Message } from '../message/Message';
import Bot from '../client/client';

export interface RunFunction {
    (
        client: Bot,
        message: Message,
        args: string[],
        level: number,
    ): Promise<unknown>;
}
export interface confObject {
    aliases: string[];
    permLevel: string;
}
export interface helpObject {
    category: string;
    description: string;
    usage: string;
}

export default interface Command {
    name: string;
    run: RunFunction;
    conf: confObject;
    help: helpObject;
}
