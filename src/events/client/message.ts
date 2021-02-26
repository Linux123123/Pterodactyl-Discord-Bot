import { Message } from '../../message/Message';
import { RunFunction } from '../../interfaces/Event';
import Bot from '../../client/client';

export const name = 'message';
export const run: RunFunction = async (client: Bot, message: Message) => {
    if (message.author.bot || !message.guild) return; // Don't listen to yourself

    const settings = (message.settings = client.functions.getSettings(
        client,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        message.guild!,
    )); // Grab the settings for this server

    // Checks if the bot was mentioned, with no message after it, returns the prefix.
    const prefixMention = new RegExp(`^<@!?${client.user?.id}>( |)$`);
    if (message.content.match(prefixMention))
        return message.reply(`My prefix is \`${settings.prefix}\``);

    if (message.content.indexOf(settings.prefix) !== 0) return; // Ignore without prefix

    // Get command and split all the arguments
    const args = message.content
        .slice(settings.prefix.length)
        .trim()
        .split(/ +/g);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const command = args.shift()!.toLowerCase();

    // If the member on a guild is invisible or not cached, fetch them.
    if (message.guild && !message.member)
        await message.guild.members.fetch(message.author);

    // Get the user or member's permission level from the elevation
    const level = client.functions.permlevel(client, message);

    // Check whether the command, or alias, exist
    const cmd =
        client.commands.get(command) ||
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        client.commands.get(client.aliases.get(command)!);
    if (!cmd) return;

    // Check permissions
    if (level < client.levelCache[cmd.conf.permLevel]) {
        return message.channel
            .send(`You do not have permission to use this command.
  Your permission level is ${level} (${
            client.config.permLevels.find((l) => l.level === level)?.name
        })
  This command requires level ${client.levelCache[cmd.conf.permLevel]} (${
            cmd.conf.permLevel
        })`);
    }

    // If the command exists, **AND** the user has permission, run it.
    client.logger(
        `${
            client.config.permLevels.find(
                (l: { level: number }) => l.level === level,
            )?.name
        } ${message.author.username} (${message.author.id}) ran command ${
            cmd.name
        }`,
        'cmd',
    );
    cmd.run(client, message, args, level);
};
