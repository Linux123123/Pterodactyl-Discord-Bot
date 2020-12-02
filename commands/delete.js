const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args, level, app) => {
    if (args.length < 1) {
        return message.reply(
            'You need to provide 2 arguments. (**USER** or **SERVER**) (**ID** or **NAME**)'
        );
    }
    const firstArg = args[0].toLowerCase();
    if (args.length > 1) {
        const secondArg = args[1];
        let isNum = /^-?[\d.]+(?:e-?\d+)?$/.test(secondArg);
        let found = false;
        if (firstArg == 'user') {
            if (!isNum) {
                app.getAllUsers().then((res) => {
                    for (let i = 0; i < res.length; i++) {
                        if (res[i].attributes.username == secondArg) {
                            secondArg = res[i].attributes.id - 1;
                            found = true;
                            break;
                        }
                    }
                });
                if (!found) {
                    return message.reply(
                        `User **${secondArg}** was not found!`
                    );
                }
            }
            app.deleteUser(secondArg).then((res) => {
                const embed = new MessageEmbed()
                    .setTitle(res)
                    .setColor(message.settings.embedColor)
                    .setTimestamp();
                message.reply(embed);
            });
        } else if (firstArg == 'server') {
            if (!isNum) {
                app.getAllServers().then((res) => {
                    for (let i = 0; i < res.length; i++) {
                        if (res[i].attributes.name == secondArg) {
                            secondArg = res[i].attributes.id - 1;
                            found = true;
                            break;
                        }
                    }
                });
                if (!found) {
                    return message.reply(
                        `Server **${secondArg}** was not found!`
                    );
                }
            }
            app.deleteServer(secondArg).then((res) => {
                const embed = new MessageEmbed()
                    .setTitle(res)
                    .setColor(client.config.EMBED.COLOR)
                    .setTimestamp();
                message.reply(embed);
            });
        }
    } else {
        return message.reply(
            'You need to provide second argument! (**Server ID** or **Server name**)'
        );
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['del'],
    permLevel: 'Administrator',
};

exports.help = {
    name: 'delete',
    category: 'Pterodactyl',
    description: 'Delete user or server',
    usage: 'delete server id or name',
};
