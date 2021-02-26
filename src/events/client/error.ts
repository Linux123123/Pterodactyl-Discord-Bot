import { RunFunction } from '../../interfaces/Event';
export const name = 'error';
export const run: RunFunction = async (client, error: unknown) => {
    client.logger(`An error has accured: \n${JSON.stringify(error)}`, 'error');
};
