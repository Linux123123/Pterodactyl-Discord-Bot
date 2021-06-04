import { Message } from '../classes/Message';
import { Bot } from '../classes/Client';

export interface RunFunction {
    (
        client: Bot,
        message: Message,
        args: string[],
        command: string
    ): Promise<unknown>;
}

export interface SetupFunction {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (client: Bot, ...params: any[]): Promise<unknown>;
}

export interface confObject {
    name: string;
    aliases: string[];
    permLevel: string;
}
export interface helpObject {
    category: string;
    description: string;
    usage: string;
}

export interface Command {
    setup?: SetupFunction;
    run: RunFunction;
    conf: confObject;
    help: helpObject;
}
