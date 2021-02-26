/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Guild } from 'discord.js';
import Bot from '../client/client';
import Command from '../interfaces/Command';
import GuildSettings from '../interfaces/GuildSettings';
import { Message } from '../message/Message';

// THIS IS HERE BECAUSE SOME PEOPLE DELETE ALL THE GUILD SETTINGS
// And then they're stuck because the default settings are also gone.
// So if you do that, you're resetting your defaults. Congrats.

export const defaultSettings: GuildSettings = {
    prefix: '!',
    modLogChannel: 'mod-log',
    modRole: 'Moderator',
    adminRole: 'Administrator',
    systemNotice: 'true',
    embedColor: '#ff0000',
};

export default {
    /* PERMISSION LEVEL FUNCTION */
    permlevel: (client: Bot, message: Message): number => {
        let permlvl = 0;

        const permOrder = client.config.permLevels
            .slice(0)
            .sort((p, c) => (p.level < c.level ? 1 : -1));

        while (permOrder.length) {
            const currentLevel = permOrder.shift()!;
            if (currentLevel.check(message)) {
                permlvl = currentLevel.level;
                break;
            }
        }
        return permlvl;
    },
    /* GUILD SETTINGS FUNCTION */

    // getSettings merges the client defaults with the guild settings. guild settings in
    // enmap should only have *unique* overrides that are different from defaults.
    getSettings: (client: Bot, guild: Guild): GuildSettings => {
        client.settings.ensure('default', defaultSettings);
        if (!guild) return client.settings.get('default')!;
        const guildConf = client.settings.get(guild.id) || {};
        return { ...client.settings.get('default')!, ...guildConf };
    },

    /*
    SINGLE-LINE AWAITMESSAGE
    const response = await client.awaitReply(msg, "Favourite Color?");
    msg.reply(`Oh, I really love ${response} too!`);
    */
    awaitReply: async (
        msg: Message,
        question: string,
        limit = 60000,
    ): Promise<string> => {
        const filter = (m: Message) => m.author.id === msg.author.id;
        await msg.channel.send(question);
        const collected = await msg.channel.awaitMessages(filter, {
            max: 1,
            time: limit,
            errors: ['time'],
        });
        return collected.first()!.content;
    },
    // Command loading
    loadCommand: async (
        client: Bot,
        commandName: string,
    ): Promise<boolean | string> => {
        try {
            client.logger(
                `Loading Command: ${
                    commandName.split('/').pop()?.split('.')[0]
                }`,
            );
            const props: Command = await import(commandName);
            client.commands.set(props.name, props);
            props.conf.aliases.forEach((alias) => {
                client.aliases.set(alias, props.name);
            });
            return false;
        } catch (e) {
            client.logger(
                `Unable to load command ${commandName}: ${e}`,
                'error',
            );
            return e;
        }
    },

    unloadCommand: async (
        client: Bot,
        commandName: string,
    ): Promise<boolean | string> => {
        try {
            client.logger(`Unloading Command: ${commandName}`);
            let command;
            if (client.commands.has(commandName)) {
                command = client.commands.get(commandName);
            } else if (client.aliases.has(commandName)) {
                command = client.commands.get(client.aliases.get(commandName)!);
            }
            if (!command)
                return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;
            const mod =
                require.cache[require.resolve(`../commands/${command.name}`)];
            delete require.cache[
                require.resolve(`../commands/${command.name}.js`)
            ];
            for (let i = 0; i < mod!.parent!.children.length; i++) {
                if (mod!.parent!.children[i] === mod) {
                    mod.parent!.children.splice(i, 1);
                    break;
                }
            }
            return false;
        } catch (e) {
            client.logger(
                `Unable to unload command ${commandName}: ${e}`,
                'error',
            );
            return e;
        }
    },
};
