module.exports = (client, app, guild) => {
    if (!guild.available) return; // If there is an outage, return.

    client.logger.cmd(
        `[GUILD LEAVE] ${guild.name} (${guild.id}) removed the bot.`
    );

    // Remove guilds data
    if (client.settings.has(guild.id)) {
        client.settings.delete(guild.id);
    }
};
