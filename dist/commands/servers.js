"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.help = exports.conf = exports.name = exports.run = void 0;
const run = async (client, message) => {
    function makeFields(page, servers) {
        return [
            {
                name: 'OWNER',
                value: servers[page].attributes.relationships?.user?.attributes
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
                value: servers[page].attributes.relationships?.egg?.attributes
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
                value: `${servers[page].attributes.relationships?.allocations?.data
                    .length}/${servers[page].attributes.feature_limits.allocations + 1}`,
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
        const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅' && user.id === message.author.id;
        const forwardsFilter = (reaction, user) => reaction.emoji.name === '➡' && user.id === message.author.id;
        const backwards = msg.createReactionCollector(backwardsFilter);
        const forwards = msg.createReactionCollector(forwardsFilter);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        backwards.on('collect', (r, u) => {
            if (page === 1)
                return r.users.remove(r.users.cache.find((u) => u === message.author));
            page--;
            embed.setTitle(servers[page - 1].attributes.name);
            embed.fields = makeFields(page - 1, servers);
            embed.setFooter(`Page ${page} of ${servers.length}`);
            msg.edit(embed);
            r.users.remove(r.users.cache.find((u) => u === message.author));
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        forwards.on('collect', (r, u) => {
            if (page === servers.length)
                return r.users.remove(r.users.cache.find((u) => u === message.author));
            page++;
            embed.setTitle(servers[page - 1].attributes.name);
            embed.fields = makeFields(page - 1, servers);
            embed.setFooter(`Page ${page} of ${servers.length}`);
            msg.edit(embed);
            r.users.remove(r.users.cache.find((u) => u === message.author));
        });
    }
    catch (e) {
        if (e.ERRORS) {
            const err = e;
            client.logger(JSON.stringify(err), 'error');
            message.reply(`There was an error: ${err.ERRORS.join(' ').replaceAll('resource', 'servers')}`);
            return;
        }
        client.logger(JSON.stringify(e), 'error');
        message.reply('There was an error while trying to send the message!');
        return;
    }
};
exports.run = run;
exports.name = 'servers';
exports.conf = {
    aliases: [''],
    permLevel: 'Administrator',
};
exports.help = {
    category: 'Pterodactyl',
    description: 'Show information about all the servers',
    usage: 'servers',
};
