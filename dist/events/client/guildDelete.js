"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.name = void 0;
exports.name = 'guildDelete';
const run = async (client, guild) => {
    if (!guild.available)
        return; // If there is an outage, return.
    client.logger(`[GUILD LEAVE] ${guild.name} (${guild.id}) removed the bot.`, 'cmd');
    // Remove guilds data
    if (client.settings.has(guild.id)) {
        client.settings.delete(guild.id);
    }
};
exports.run = run;
