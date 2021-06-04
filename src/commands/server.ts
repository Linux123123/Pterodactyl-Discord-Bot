import { RunFunction } from '../interfaces/Command';

export const run: RunFunction = async (client, message, args) => {
    if (!args[0])
        return message.reply('You need to provide the id of the server!');
    try {
        const clientServer = await client.client.getServerInfo(args[0]);
        const server = await client.app.getServerInfo(
            clientServer.internal_id,
            {
                allocations: true,
                user: true,
                egg: true,
                databases: true,
            }
        );

        message.channel.send(
            client.embed(
                {
                    title: `Server: ${server.name}`,
                    description: server.description,
                    fields: [
                        {
                            name: 'OWNER',
                            value: server.relationships?.user?.attributes
                                .username,
                            inline: true,
                        },
                        {
                            name: 'Server ID',
                            value: server.identifier,
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
                            value: `${
                                server.relationships?.allocations?.data.length
                            }/${server.feature_limits.allocations + 1}`,
                            inline: true,
                        },
                        {
                            name: 'BACKUP LIMIT',
                            value: server.feature_limits.backups,
                            inline: true,
                        },
                    ],
                },
                message
            )
        );
    } catch (e) {
        return message.reply(client.functions.handleCmdError(client, e));
    }
};
export const conf = {
    name: 'server',
    aliases: ['serv'],
    permLevel: 'Administrator',
};
export const help = {
    category: 'Pterodactyl',
    description: 'Get a servers information',
    usage: 'server <id>',
};
