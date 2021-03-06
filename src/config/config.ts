import { Message } from '../classes/Message';
import { Config } from '../interfaces/Config';

export const config: Config = {
    // Bot Creator, level 10 by default. Should never be anything else than then Linux123123 ID
    ownerID: '244024524289343489',
    // Your Bot's Token. Available on https://discord.com/developers/applications/me
    token: 'TOKEN',
    // Pterodactyl api token
    pteroToken: 'PTERO_TOKEN',
    // Pterodactyl HOST address
    pteroHost: 'PTERO_TOKEN',
    // PERMISSION LEVEL DEFINITIONS.
    permLevels: [
        // This is the lowest permisison level, this is for non-roled users.
        {
            level: 0,
            name: 'User',
            // Don't bother checking, just return true which allows them to execute any command their
            // level allows them to.
            check: () => true,
        },
        // This is your permission level, the staff levels should always be above the rest of the roles.
        {
            level: 2,
            // This is the name of the role.
            name: 'Moderator',
            // The following lines check the guild the message came from for the roles.
            // Then it checks if the member that authored the message has the role.
            // If they do return true, which will allow them to execute the command in question.
            // If they don't then return false, which will prevent them from executing the command.
            check: (message: Message): boolean => {
                try {
                    const modRole = message.guild?.roles.cache.find(
                        (r) =>
                            r.name.toLowerCase() ===
                            message.settings.modRole.toLowerCase(),
                    );
                    if (modRole && message.member?.roles.cache.has(modRole.id))
                        return true;
                    return false;
                } catch (e) {
                    return false;
                }
            },
        },
        {
            level: 3,
            name: 'Administrator',
            check: (message: Message): boolean => {
                try {
                    const adminRole = message.guild?.roles.cache.find(
                        (r) =>
                            r.name.toLowerCase() ===
                            message.settings.adminRole.toLowerCase(),
                    );
                    if (!adminRole) return false;
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    return message.member!.roles.cache.has(adminRole.id);
                } catch (e) {
                    return false;
                }
            },
        },
        // This is the server owner.
        {
            level: 4,
            name: 'Server Owner',
            // Simple check, if the guild owner id matches the message author's ID, then it will return true.
            // Otherwise it will return false.
            check: (message) =>
                message.channel.type === 'text'
                    ? message.guild?.ownerID === message.author.id
                        ? true
                        : false
                    : false,
        },
        {
            level: 10,
            name: 'Bot Creator',
            // Another simple check, compares the message author id to the one stored in the config file.
            check: (message) =>
                message.client.config.ownerID === message.author.id,
        },
    ],
};
