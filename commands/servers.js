const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args, level, app) => {
    if (args.length < 1) {
        let page = 1;
        app.getAllServers().then((res) => {
            function makeField(page) {
                return {
                    name: `**Id**: **${res[page].attributes.id}**`,
                    value: `**Cpu**: **${res[page].attributes.limits.cpu}%**
                    **Memory**: **${res[page].attributes.limits.memory}MB**
                    **Disk**: **${res[page].attributes.limits.disk}MB**
                    **Databases**: **${res[page].attributes.feature_limits.databases}**`,
                };
            }

            const embed = new MessageEmbed()
                .setTitle(res[0].attributes.name)
                .setColor(message.settings.embedColor)
                .setFooter(`Page 1 of ${res.length}`)
                .addFields(makeField(0))
                .setTimestamp();
            message.channel.send(embed).then((msg) => {
                msg.react('⬅').then((r) => {
                    msg.react('➡');

                    // Filters
                    const backwardsFilter = (reaction, user) =>
                        reaction.emoji.name === '⬅' &&
                        user.id === message.author.id;
                    const forwardsFilter = (reaction, user) =>
                        reaction.emoji.name === '➡' &&
                        user.id === message.author.id;

                    const backwards = msg.createReactionCollector(
                        backwardsFilter,
                        { timer: 100 }
                    );
                    const forwards = msg.createReactionCollector(
                        forwardsFilter,
                        { timer: 100 }
                    );

                    backwards.on('collect', (r, u) => {
                        if (page === 1)
                            return r.users.remove(
                                r.users.cache
                                    .filter((u) => u === message.author)
                                    .first()
                            );
                        page--;
                        embed.title = res[page - 1].attributes.name;
                        embed.fields = makeField(page - 1);
                        embed.footer = {
                            text: `Page ${page} of ${res.length}`,
                        };
                        msg.edit(embed);
                        r.users.remove(
                            r.users.cache
                                .filter((u) => u === message.author)
                                .first()
                        );
                    });

                    forwards.on('collect', (r, u) => {
                        if (page === res.length)
                            return r.users.remove(
                                r.users.cache
                                    .filter((u) => u === message.author)
                                    .first()
                            );
                        page++;
                        embed.title = res[page - 1].attributes.name;
                        embed.fields = makeField(page - 1);
                        embed.footer = {
                            text: `Page ${page} of ${res.length}`,
                        };
                        msg.edit(embed);
                        r.users.remove(
                            r.users.cache
                                .filter((u) => u === message.author)
                                .first()
                        );
                    });
                });
            });
        });
    } else {
        return message.reply('No arguments are needed!');
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['srv'],
    permLevel: 'Moderator',
};

exports.help = {
    name: 'servers',
    category: 'Pterodactyl',
    description: 'Show all servers',
    usage: 'servers',
};
