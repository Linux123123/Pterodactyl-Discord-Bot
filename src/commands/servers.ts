import { JSPteroAPIError } from '@linux123123/jspteroapi';
import { Server } from '@linux123123/jspteroapi/dist/application/interfaces/Server';
import { CollectorFilter, EmbedField, EmbedFieldData } from 'discord.js';
import { RunFunction } from '../interfaces/Command';

export const run: RunFunction = async (client, message) => {
    function makeFields(page: number, servers: Server[]): EmbedFieldData[] {
        return [
            {
                name: 'OWNER',
                value:
                    servers[page].attributes.relationships?.user?.attributes
                        .username,
                inline: true,
            },
            {
                name: 'Server ID',
                value: servers[page].attributes.id,
                inline: true,
            },
            {
                name: 'EGG',
                value:
                    servers[page].attributes.relationships?.egg?.attributes
                        .name,
                inline: true,
            },
            {
                name: '\u200b',
                value: '**LIMITS:**',
            },
            {
                name: 'CPU',
                value: servers[page].attributes.limits.cpu
                    ? servers[page].attributes.limits.cpu
                    : 'Unlimited',
                inline: true,
            },
            {
                name: 'MEMORY',
                value: servers[page].attributes.limits.memory
                    ? servers[page].attributes.limits.memory
                    : 'Unlimited',
                inline: true,
            },
            {
                name: 'DISK',
                value: servers[page].attributes.limits.disk
                    ? servers[page].attributes.limits.disk
                    : 'Unlimited',
                inline: true,
            },
            {
                name: 'DATABASES',
                value: `${servers[page].attributes.relationships?.databases?.data.length}/${servers[page].attributes.feature_limits.databases}`,
                inline: true,
            },
            {
                name: 'ALLOCATIONS',
                value: `${
                    servers[page].attributes.relationships?.allocations?.data
                        .length
                }/${servers[page].attributes.feature_limits.allocations + 1}`,
                inline: true,
            },
            {
                name: 'BACKUP LIMIT',
                value: servers[page].attributes.feature_limits.backups,
                inline: true,
            },
        ];
    }
    try {
        let page = 1;
        const servers = await client.app.getAllServers({
            allocations: true,
            user: true,
            egg: true,
            databases: true,
        });
        const embed = client.embed({
            title: servers[0].attributes.name,
            fields: makeFields(0, servers),
            footer: { text: `Page 1 of ${servers.length}` },
            color: message.settings.embedColor,
            timestamp: new Date(),
        });
        const msg = await message.channel.send(embed);
        await msg.react('⬅');
        await msg.react('➡');
        // Filters
        const backwardsFilter: CollectorFilter = (reaction, user) =>
            reaction.emoji.name === '⬅' && user.id === message.author.id;
        const forwardsFilter: CollectorFilter = (reaction, user) =>
            reaction.emoji.name === '➡' && user.id === message.author.id;

        const backwards = msg.createReactionCollector(backwardsFilter);
        const forwards = msg.createReactionCollector(forwardsFilter);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        backwards.on('collect', (r, u) => {
            if (page === 1)
                return r.users.remove(
                    r.users.cache.find((u) => u === message.author),
                );
            page--;
            embed.setTitle(servers[page - 1].attributes.name);
            embed.fields = makeFields(page - 1, servers) as EmbedField[];
            embed.setFooter(`Page ${page} of ${servers.length}`);
            msg.edit(embed);
            r.users.remove(r.users.cache.find((u) => u === message.author));
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        forwards.on('collect', (r, u) => {
            if (page === servers.length)
                return r.users.remove(
                    r.users.cache.find((u) => u === message.author),
                );
            page++;
            embed.setTitle(servers[page - 1].attributes.name);
            embed.fields = makeFields(page - 1, servers) as EmbedField[];
            embed.setFooter(`Page ${page} of ${servers.length}`);
            msg.edit(embed);
            r.users.remove(r.users.cache.find((u) => u === message.author));
        });
    } catch (e) {
        if (e.ERRORS) {
            const err: JSPteroAPIError = e;
            client.logger(JSON.stringify(err), 'error');
            message.reply(
                `There was an error: ${err.ERRORS.join(' ').replaceAll(
                    'resource',
                    'servers',
                )}`,
            );
            return;
        }
        client.logger(JSON.stringify(e), 'error');
        message.reply('There was an error while trying to send the message!');
        return;
    }
};
export const name = 'servers';

export const conf = {
    aliases: [''],
    permLevel: 'Administrator',
};
export const help = {
    category: 'Pterodactyl',
    description: 'Show information about all the servers',
    usage: 'servers',
};
