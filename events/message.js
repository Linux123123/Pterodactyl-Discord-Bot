module.exports = async (client, app, message) => {
    if (message.author.bot) return; // Don't listen to yourself
    const settings = (message.settings = client.getSettings(message.guild)); // Grab the settings for this server

    // Checks if the bot was mentioned, with no message after it, returns the prefix.
    const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(prefixMention)) {
        return message.reply(`My prefix is \`${settings.prefix}\``);
    }

    if (message.content.indexOf(settings.prefix) !== 0) return; // Ignore without prefix

    // Get command and split all the arguments
    const args = message.content
        .slice(settings.prefix.length)
        .trim()
        .split(/ +/g);
    const command = args.shift().toLowerCase();

    // If the member on a guild is invisible or not cached, fetch them.
    if (message.guild && !message.member)
        await message.guild.members.fetch(message.author);

    // Get the user or member's permission level from the elevation
    const level = client.permlevel(message);

    // Check whether the command, or alias, exist
    const cmd =
        client.commands.get(command) ||
        client.commands.get(client.aliases.get(command));
    if (!cmd) return;

    // Some commands may not be useable in DMs. This check prevents those commands from running.
    if (cmd && !message.guild && cmd.conf.guildOnly)
        return message.channel.send(
            'This command is unavailable via private message. Please run this command in a guild.'
        );
    // Check permissions
    if (level < client.levelCache[cmd.conf.permLevel]) {
        if (settings.systemNotice === 'true') {
            return message.channel
                .send(`You do not have permission to use this command.
  Your permission level is ${level} (${
                client.config.permLevels.find((l) => l.level === level).name
            })
  This command requires level ${client.levelCache[cmd.conf.permLevel]} (${
                cmd.conf.permLevel
            })`);
        } else {
            return;
        }
    }

    // Assign author perms level to level
    message.author.permLevel = level;

    message.flags = [];
    while (args[0] && args[0][0] === '-') {
        message.flags.push(args.shift().slice(1));
    }
    // If the command exists, **AND** the user has permission, run it.
    client.logger.cmd(
        `[CMD] ${
            client.config.permLevels.find((l) => l.level === level).name
        } ${message.author.username} (${message.author.id}) ran command ${
            cmd.help.name
        }`
    );
    cmd.run(client, message, args, level, app);
};
