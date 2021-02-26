"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.name = void 0;
exports.name = 'guildCreate';
const run = (client, guild) => {
    client.logger(`[GUILD JOIN] ${guild.name} (${guild.id}) added the bot. Owner: ${guild.owner?.user.tag} (${guild.owner?.user.id}), 'cmd`);
};
exports.run = run;
