import { inspect } from 'util';
import { RunFunction } from '../interfaces/Command';
import { defaultSettings } from '../modules/Functions';
export const run: RunFunction = async (
    client,
    message,
    [action, key, ...value],
) => {
    if (action === 'edit') {
        if (!key) return message.reply('Please specify a key to edit');
        if (!defaultSettings[key])
            return message.reply('This key does not exist in the settings');
        if (value.length < 1)
            return message.reply('Please specify a new value');

        defaultSettings[key] = value.join(' ');

        client.settings.set('default', defaultSettings);
        message.reply(`${key} successfully edited to ${value.join(' ')}`);
    }
    // Display a key's default value
    else if (action === 'get') {
        if (!key) return message.reply('Please specify a key to view');
        if (!defaultSettings[key])
            return message.reply('This key does not exist in the settings');
        message.reply(
            `The value of ${key} is currently ${defaultSettings[key]}`,
        );
    }
    // Display all default settings.
    else {
        await message.channel.send(
            `***__Bot Default Settings__***\n\`\`\`json\n${inspect(
                defaultSettings,
            )}\n\`\`\``,
        );
    }
};
export const conf = {
    name: 'conf',
    aliases: ['defaults'],
    permLevel: 'Bot Creator',
};

export const help = {
    category: 'System',
    description: 'Modify the default configuration for all guilds.',
    usage: 'conf <view/get/edit> <key> <value>',
};
