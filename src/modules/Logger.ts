/*
Logger class for easy and aesthetically pleasing console logging 
*/
import chalk from 'chalk';
import moment from 'moment';

type logType = 'log' | 'error' | 'debug' | 'cmd' | 'warn';

export class Logger {
    private logger(content: string, type: string) {
        const timestamp = `[${moment().format('YYYY-MM-DD HH:mm:ss')}]:`;
        switch (type) {
            case 'log': {
                return console.log(
                    `${timestamp} ${chalk.bgBlue(
                        type.toUpperCase()
                    )} ${content} `
                );
            }
            case 'warn': {
                return console.log(
                    `${timestamp} ${chalk.black.bgYellow(
                        type.toUpperCase()
                    )} ${content} `
                );
            }
            case 'error': {
                return console.log(
                    `${timestamp} ${chalk.bgRed(
                        type.toUpperCase()
                    )} ${content} `
                );
            }
            case 'debug': {
                return console.log(
                    `${timestamp} ${chalk.green(
                        type.toUpperCase()
                    )} ${content} `
                );
            }
            case 'cmd': {
                return console.log(
                    `${timestamp} ${chalk.black.bgWhite(
                        type.toUpperCase()
                    )} ${content}`
                );
            }
            case 'ready': {
                return console.log(
                    `${timestamp} ${chalk.black.bgGreen(
                        type.toUpperCase()
                    )} ${content}`
                );
            }
            default:
                throw new TypeError(
                    'Logger type must be either warn, debug, log, ready, cmd or error.'
                );
        }
    }
    public log(content: string, type: logType = 'log'): void {
        this.logger(content, type);
    }
    public error(content: string): void {
        this.logger(content, 'error');
    }
    public warn(content: string): void {
        this.logger(content, 'warn');
    }
    public debug(content: string): void {
        this.logger(content, 'debug');
    }
    public cmd(content: string): void {
        this.logger(content, 'cmd');
    }
    public ready(content: string): void {
        this.logger(content, 'ready');
    }
}
