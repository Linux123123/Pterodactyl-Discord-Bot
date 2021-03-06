import { RunFunction } from '../interfaces/Command';

export const run: RunFunction = async (client, message, args) => {
    if (!args || args.length < 1)
        return message.reply('Must provide a command to reload!');
    const command =
        client.commands.get(args[0]) ||
        client.commands.get(`${client.aliases.get(args[0])}`);
    if (!command) return;
    const unLoadResponse = await client.functions.unloadCommand(
        client,
        args[0],
    );
    if (unLoadResponse)
        return message.reply(`Error Unloading: ${unLoadResponse}`);

    await client.functions.loadCommand(
        client,
        `${__dirname}/${command.conf.name}.js`,
    );
    message.reply(`The command \`${command.conf.name}\` has been reloaded`);
};
export const conf = {
    name: 'reload',
    aliases: [],
    permLevel: 'Bot Admin',
};

export const help = {
    category: 'System',
    description: `Reloads a command that's been modified.`,
    usage: 'reload [command]',
};
