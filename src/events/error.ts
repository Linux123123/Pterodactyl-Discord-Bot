import { RunFunction } from '../interfaces/Event';
export const run: RunFunction = (client, error) => {
    client.logger.error(`An error has accured: ${error}`);
    console.error(error);
};
