import { RunFunction } from '../interfaces/Event';
export const run: RunFunction = async (client, warn) => {
    client.logger.warn(`A warning has accured: ${warn}`);
    console.warn(warn);
};
