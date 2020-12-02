const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args, level) => {
    const embed = new MessageEmbed()
        .setTitle('**🏓 PING!**')
        .setColor(message.settings.embedColor)
        .setTimestamp()
        .addFields(
            {
                name: 'BOT Latency',
                value: `**${Date.now() - message.createdTimestamp}ms**`,
            },
            {
                name: 'Discord API Latency',
                value: `**${Math.round(client.ws.ping)}ms**`,
            }
        );
    message.channel.send(embed);
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['latency'],
    permLevel: 'User',
};

exports.help = {
    name: 'ping',
    category: 'Miscelaneous',
    description: 'Bot latency',
    usage: 'ping',
};
