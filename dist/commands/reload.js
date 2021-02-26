"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.help = exports.conf = exports.name = exports.run = void 0;
const run = async (client, message, args) => {
    if (!args || args.length < 1)
        return message.reply('Must provide a command to reload!');
    const command = client.commands.get(args[0]) ||
        client.commands.get(client.aliases.get(args[0]));
    const unLoadResponse = await client.functions.unloadCommand(client, args[0]);
    if (unLoadResponse)
        return message.reply(`Error Unloading: ${unLoadResponse}`);
    const loadResponse = await client.functions.loadCommand(client, `${__dirname}/${command.name}.js`);
    if (loadResponse)
        return message.reply(`Error Loading: ${loadResponse}`);
    message.reply(`The command \`${command.name}\` has been reloaded`);
};
exports.run = run;
exports.name = 'reload';
exports.conf = {
    aliases: [],
    permLevel: 'Bot Admin',
};
exports.help = {
    category: 'System',
    description: `Reloads a command that's been modified.`,
    usage: 'reload [command]',
};
