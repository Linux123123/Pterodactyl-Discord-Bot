import { Bot } from '../classes/Client';

export function handleExceptions(client: Bot): void {
    process.on('uncaughtException', (err) => {
        let errorMsg = '';
        if (err.stack) {
            errorMsg = err.stack.replace(
                new RegExp(`${__dirname}/`, 'g'),
                './'
            );
        }
        client.logger.error(`Uncaught Exception: ${errorMsg}`);
        console.error(err);
        process.exit(1);
    });
    process.on('unhandledRejection', (err) => {
        client.logger.error(`Unhandled rejection: ${err}`);
        console.error(err);
    });
}
