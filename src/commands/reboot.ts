import { RunFunction } from '../interfaces/Command';

export const run: RunFunction = async (client, message) => {
    await message.reply('Bot is shutting down.');
    client.destroy();
    process.exit(0);
};
export const conf = {
    name: 'reboot',
    aliases: [],
    permLevel: 'Bot Creator',
};

export const help = {
    category: 'System',
    description:
        'Shuts down the bot and starts again if running under server manager.',
    usage: 'reboot',
};
