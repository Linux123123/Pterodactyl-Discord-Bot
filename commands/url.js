const { MessageEmbed } = require('discord.js');

exports.run = async (client, message) => {
    const embed = new MessageEmbed()
        .setTitle(client.config.pteroHost)
        .setColor(message.settings.embedColor)
        .setTimestamp();
    message.channel.send(embed);
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['link'],
    permLevel: 'User',
};

exports.help = {
    name: 'url',
    category: 'Pterodactyl',
    description: 'Url of Pterodactyl panel',
    usage: 'url',
};
