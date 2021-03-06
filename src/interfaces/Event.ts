import { Bot } from '../classes/Client';

export interface RunFunction {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (client: Bot, ...params: any[]): void;
}
export interface Event {
    run: RunFunction;
}
