const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args, level, app) => {
    if (args.length < 1) {
        return message.reply(
            'You need to provide at least 2 arguments! (**user**) (**id** or **name**)'
        );
    }
    const firstArg = args[0].toLowerCase();
    if (args.length > 1) {
        let secondArg = args[1].toLowerCase();
        if (firstArg == 'user') {
            app.getAllUsers().then((res) => {
                let isNum = /^-?[\d.]+(?:e-?\d+)?$/.test(secondArg);
                let found = false;
                if (!isNum) {
                    for (let i = 0; i < res.length; i++) {
                        if (res[i].attributes.username == secondArg) {
                            secondArg = res[i].attributes.id;
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        return message.reply(
                            `User ${secondArg} was not found!`
                        );
                    }
                }
                secondArg = secondArg - 1; // Because arrays are from 0 and id's from 1
                const embed = new MessageEmbed()
                    .setTitle('User: ' + res[secondArg].attributes.username)
                    .setTimestamp()
                    .setColor(message.settings.embedColor)
                    .addField(
                        'First name',
                        res[secondArg].attributes.first_name
                    )
                    .addField('Last name', res[secondArg].attributes.last_name)
                    .addField('ID', res[secondArg].attributes.id)
                    .addField('Email', res[secondArg].attributes.email)
                    .addField('Admin', res[secondArg].attributes.root_admin);
                message.channel.send(embed);
            });
        }
    } else {
        if (firstArg == 'user') {
            message.reply(
                'You need to provide second argument! (**User ID** or **username**)'
            );
        }
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['chck'],
    permLevel: 'Moderator',
};

exports.help = {
    name: 'check',
    category: 'Pterodactyl',
    description: 'Check user',
    usage: 'check user id or name',
};
