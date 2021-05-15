import { User } from '@linux123123/jspteroapi/dist/application/interfaces/User';
import { CollectorFilter, EmbedField, EmbedFieldData } from 'discord.js';
import { RunFunction } from '../interfaces/Command';

export const run: RunFunction = async (client, message) => {
    function makeFields(page: number, users: User[]): EmbedFieldData[] {
        let servers = '\u200b';
        users[page].attributes.relationships?.servers.data.forEach((srv, i) => {
            servers += `${i + 1}. ${srv.attributes.name}\n`;
        });
        return [
            {
                name: 'User ID',
                value: users[page].attributes.id,
                inline: true,
            },
            {
                name: 'EMAIL',
                value: users[page].attributes.email,
                inline: true,
            },
            {
                name: 'ADMIN',
                value: users[page].attributes.root_admin,
                inline: true,
            },
            {
                name: 'Servers:',
                value: servers,
            },
        ];
    }
    try {
        let page = 1;
        const users = await client.app.getAllUsers({
            servers: true,
        });
        const embed = client.embed(
            {
                title: users[0].attributes.username,
                description: `${users[0].attributes.first_name} ${users[0].attributes.last_name}`,
                fields: makeFields(0, users),
                footer: { text: `Page 1 of ${users.length}` },
            },
            message
        );
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
                    r.users.cache.find((u) => u === message.author)
                );
            page--;
            embed.setTitle(users[page - 1].attributes.username);
            embed.description = `${users[page - 1].attributes.first_name} ${
                users[page].attributes.last_name
            }`;
            embed.fields = makeFields(page - 1, users) as EmbedField[];
            embed.setFooter(`Page ${page} of ${users.length}`);
            msg.edit(embed);
            r.users.remove(r.users.cache.find((u) => u === message.author));
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        forwards.on('collect', (r, u) => {
            if (page === users.length)
                return r.users.remove(
                    r.users.cache.find((u) => u === message.author)
                );
            page++;
            embed.setTitle(users[page - 1].attributes.username);
            embed.description = `${users[page - 1].attributes.first_name} ${
                users[page].attributes.last_name
            }`;
            embed.fields = makeFields(page - 1, users) as EmbedField[];
            embed.setFooter(`Page ${page} of ${users.length}`);
            msg.edit(embed);
            r.users.remove(r.users.cache.find((u) => u === message.author));
        });
    } catch (e) {
        return message.reply(client.functions.handleCmdError(client, e));
    }
};
export const conf = {
    name: 'users',
    aliases: [''],
    permLevel: 'Administrator',
};
export const help = {
    category: 'Pterodactyl',
    description: 'Show information about all users',
    usage: 'users',
};
