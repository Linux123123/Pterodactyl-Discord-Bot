import { Guild } from 'discord.js';
import { RunFunction } from '../interfaces/Event';
export const run: RunFunction = (client, guild: Guild) => {
    client.logger.cmd(
        `[GUILD JOIN] ${guild.name} (${guild.id}) added the bot. Owner: ${guild.owner?.user.tag} (${guild.owner?.user.id})`
    );
};
