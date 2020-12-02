const { MessageEmbed } = require('discord.js');

/*
The HELP command is used to display every command's name and description
to the user, so that he may see what commands are available. The help
command is also filtered by level, so if a user does not have access to
a command, it is not shown to them. If a command name is given with the
help command, its extended help is shown.
*/

exports.run = (client, message, args, level) => {
    // If no specific command is called, show all filtered commands.
    if (!args[0]) {
        // Filter all commands by which are available for the user's level, using the <Collection>.filter() method.
        const myCommands = message.guild
            ? client.commands.filter(
                  (cmd) => client.levelCache[cmd.conf.permLevel] <= level
              )
            : client.commands.filter(
                  (cmd) =>
                      client.levelCache[cmd.conf.permLevel] <= level &&
                      cmd.conf.guildOnly !== true
              );

        let currentCategory = '';
        let fields = [];
        let fieldsNum = 0;
        const sorted = myCommands
            .array()
            .sort((p, c) =>
                p.help.category > c.help.category
                    ? 1
                    : p.help.name > c.help.name &&
                      p.help.category === c.help.category
                    ? 1
                    : -1
            );
        sorted.forEach((c) => {
            const cat = c.help.category.toProperCase();
            if (currentCategory !== cat) {
                if (currentCategory !== '') fieldsNum += 1;
                fields[fieldsNum] = { name: `${cat}`, value: '' };
                currentCategory = cat;
            }
            fields[
                fieldsNum
            ].value += `${message.settings.prefix}${c.help.name} - ${c.help.description}\n`;
        });
        const embed = new MessageEmbed()
            .setTitle('Command list')
            .setColor(message.settings.embedColor)
            .setDescription(
                `**Use ${message.settings.prefix}help <commandname> for details**`
            )
            .addFields(fields)
            .setTimestamp();
        message.channel.send(embed);
    } else {
        // Show individual command's help.
        let command = args[0];
        if (client.commands.has(command)) {
            command = client.commands.get(command);
            if (level < client.levelCache[command.conf.permLevel]) return;
            const embed = new MessageEmbed()
                .setTitle('Command')
                .setColor(message.settings.embedColor)
                .addFields(
                    {
                        name: 'Description:',
                        value: command.help.description,
                    },
                    { name: 'Usage:', value: command.help.usage },
                    { name: 'Aliases:', value: command.conf.aliases.join(', ') }
                )
                .setTimestamp();
            message.channel.send(embed);
        }
    }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['h', 'halp'],
    permLevel: 'User',
};

exports.help = {
    name: 'help',
    category: 'System',
    description:
        'Displays all the available commands for your permission level.',
    usage: 'help [command]',
};
