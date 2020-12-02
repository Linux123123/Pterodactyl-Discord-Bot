exports.run = async (client, message, args, level) => {
    await message.reply('Bot is shutting down.');
    await Promise.all(client.commands.map((cmd) => client.unloadCommand(cmd)));
    process.exit(0);
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 'Bot Admin',
};

exports.help = {
    name: 'reboot',
    category: 'System',
    description:
        'Shuts down the bot and starts again if running under server manager.',
    usage: 'reboot',
};
