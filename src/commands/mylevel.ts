import { RunFunction } from '../interfaces/Command';

export const run: RunFunction = async (client, message, args, level) => {
    const friendly = client.config.permLevels.find(
        (l: { level: number }) => l.level === level,
    )?.name;
    message.reply(`Your permission level is: ${level} - ${friendly}`);
};
export const name = 'mylevel';

export const conf = {
    aliases: [],
    permLevel: 'User',
};

export const help = {
    category: 'Miscelaneous',
    description:
        'Tells you your permission level for the current message location.',
    usage: 'mylevel',
};
