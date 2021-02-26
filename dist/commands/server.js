"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.help = exports.conf = exports.name = exports.run = void 0;
const run = async (client, message, args) => {
    if (!args[0])
        return message.reply('You need to provide the id of the server!');
    try {
        const server = await client.app.getServerInfo(parseInt(args[0]), {
            allocations: true,
            user: true,
            egg: true,
            databases: true,
        });
        message.channel.send(client.embed({
            title: `Server: ${server.name}`,
            description: server.description,
            fields: [
                {
                    name: 'OWNER',
                    value: server.relationships?.user?.attributes.username,
                    inline: true,
                },
                {
                    name: 'Server ID',
                    value: server.id,
                    inline: true,
                },
                {
                    name: 'EGG',
                    value: server.relationships?.egg?.attributes.name,
                    inline: true,
                },
                {
                    name: '\u200b',
                    value: '**LIMITS:**',
                },
                {
                    name: 'CPU',
                    value: server.limits.cpu
                        ? server.limits.cpu
                        : 'Unlimited',
                    inline: true,
                },
                {
                    name: 'MEMORY',
                    value: server.limits.memory
                        ? server.limits.memory
                        : 'Unlimited',
                    inline: true,
                },
                {
                    name: 'DISK',
                    value: server.limits.disk
                        ? server.limits.disk
                        : 'Unlimited',
                    inline: true,
                },
                {
                    name: 'DATABASES',
                    value: `${server.relationships?.databases?.data.length}/${server.feature_limits.databases}`,
                    inline: true,
                },
                {
                    name: 'ALLOCATIONS',
                    value: `${server.relationships?.allocations?.data.length}/${server.feature_limits.allocations + 1}`,
                    inline: true,
                },
                {
                    name: 'BACKUP LIMIT',
                    value: server.feature_limits.backups,
                    inline: true,
                },
            ],
            color: message.settings.embedColor,
            timestamp: new Date(),
        }));
    }
    catch (e) {
        if (e.ERRORS) {
            const err = e;
            client.logger(JSON.stringify(err), 'error');
            message.reply(`There was an error: ${err.ERRORS.join(' ').replaceAll('resource', 'server')}`);
            return;
        }
        client.logger(JSON.stringify(e), 'error');
        message.reply('There was an error while trying to send the message!');
        return;
    }
};
exports.run = run;
exports.name = 'server';
exports.conf = {
    aliases: ['serv'],
    permLevel: 'Administrator',
};
exports.help = {
    category: 'Pterodactyl',
    description: 'Get a servers information',
    usage: 'server <id>',
};
