import { RunFunction } from '../interfaces/Command';

export const run: RunFunction = async (client, message) => {
    message.reply(
        `Your permission level is: ${message.author.level} - ${message.author.levelName}`
    );
};
export const conf = {
    name: 'mylevel',
    aliases: ['myperms', 'level'],
    permLevel: 'User',
};

export const help = {
    category: 'Miscelaneous',
    description:
        'Tells you your permission level for the current message location.',
    usage: 'mylevel',
};
