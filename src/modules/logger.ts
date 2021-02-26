/*
Logger class for easy and aesthetically pleasing console logging 
*/
import chalk from 'chalk';
import moment from 'moment';

const Logger = (content: string, type = 'log'): void => {
    const timestamp = `[${moment().format('YYYY-MM-DD HH:mm:ss')}]:`;
    switch (type) {
        case 'log': {
            return console.log(
                `${timestamp} ${chalk.bgBlue(type.toUpperCase())} ${content} `,
            );
        }
        case 'warn': {
            return console.log(
                `${timestamp} ${chalk.black.bgYellow(
                    type.toUpperCase(),
                )} ${content} `,
            );
        }
        case 'error': {
            return console.log(
                `${timestamp} ${chalk.bgRed(type.toUpperCase())} ${content} `,
            );
        }
        case 'debug': {
            return console.log(
                `${timestamp} ${chalk.green(type.toUpperCase())} ${content} `,
            );
        }
        case 'cmd': {
            return console.log(
                `${timestamp} ${chalk.black.bgWhite(
                    type.toUpperCase(),
                )} ${content}`,
            );
        }
        case 'ready': {
            return console.log(
                `${timestamp} ${chalk.black.bgGreen(
                    type.toUpperCase(),
                )} ${content}`,
            );
        }
        default:
            throw new TypeError(
                'Logger type must be either warn, debug, log, ready, cmd or error.',
            );
    }
};

export default Logger;
