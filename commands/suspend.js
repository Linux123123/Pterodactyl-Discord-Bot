const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args, level, app) => {
    if (args.length > 0) {
        let arg;
        let found = false;
        if (args.length == 1) {
            arg = args[0];
        } else {
            arg = args.join(' ');
        }
        let isNum = /^-?[\d.]+(?:e-?\d+)?$/.test(arg);
        app.getAllServers().then((res) => {
            if (!isNum) {
                for (let i = 0; i < res.length; i++) {
                    if (res[i].attributes.name == arg) {
                        arg = res[i].attributes.id;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    return message.reply(`Server **${arg}** was not found!`);
                }
            }
            app.suspendServer(arg).then((res) => {
                const embed = new MessageEmbed()
                    .setTitle(res)
                    .setColor(message.settings.embedColor)
                    .setTimestamp();
                message.channel.send(embed);
            });
        });
    } else {
        message.reply('You need to provide argument! (**ID**, **name**)');
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['susp'],
    permLevel: 'Administrator',
};

exports.help = {
    name: 'suspend',
    category: 'Pterodactyl',
    description: 'Suspend server',
    usage: 'suspend',
};
