import { MessageEmbed, TextChannel } from 'discord.js';
import { Bot } from '../classes/Client';
import { Message } from '../classes/Message';
import { RunFunction, SetupFunction } from '../interfaces/Command';
import { ContinueCMD } from '../interfaces/ContinueCMD';
import { GuildSettings } from '../interfaces/GuildSettings';

async function makeEmbedFields(
    client: Bot,
    nodeId: string,
    embed?: MessageEmbed,
    settings?: GuildSettings
) {
    const node = await client.app.getNodeInfo(parseInt(nodeId), {
        servers: true,
        allocations: true,
    });
    if (!embed) {
        embed = client.embed(
            { title: node.name },
            undefined,
            settings?.embedColor
        );
        return embed;
    } else {
        let assignedAloccations = 0;
        node.relationships?.allocations?.data.forEach((allocation) => {
            if (allocation.attributes.assigned) assignedAloccations++;
        });
        embed.fields = [
            {
                name: 'Servers',
                value: `${node.relationships?.servers?.data.length}`,
                inline: true,
            },
            {
                name: 'Allocations',
                value: `${assignedAloccations}/${node.relationships?.allocations?.data.length}`,
                inline: true,
            },
        ];
        embed.setTimestamp();
        return embed;
    }
}

const start = async (
    client: Bot,
    msg: Message,
    id: string,
    node: string,
    settings: GuildSettings
) => {
    const embed = await makeEmbedFields(client, node, undefined, settings);
    const interval = setInterval(async () => {
        if (!client.continueCmd.has(id)) clearInterval(interval);
        msg.edit(await makeEmbedFields(client, node, embed));
    }, 10000);
};

export const setup: SetupFunction = async (
    client,
    id: string,
    conf: ContinueCMD
) => {
    try {
        const channel = (await client.channels.fetch(
            conf.channelId
        )) as TextChannel;
        const settings = client.functions.getSettings(client, channel.guild);
        const msg = (await channel.messages.fetch(conf.messageId)) as Message;
        start(client, msg, id, conf.args[0], settings);
    } catch (e) {
        client.logger.error(e);
        console.error(e);
        return;
    }
};

export const run: RunFunction = async (client, message, args) => {
    if (!args[0] || args.length > 1)
        return message.reply('You need to provide one node id!');
    try {
        const embed = client.embed({ title: 'Live node status' }, message);
        const msg = (await message.channel.send(embed)) as Message;
        const id = client.genShortID();
        client.continueCmd.set(id, {
            command: conf.name,
            channelId: message.channel.id,
            messageId: msg.id,
            args: args,
        });
        start(client, msg, id, args[0], message.settings);
    } catch (e) {
        return message.reply(client.functions.handleCmdError(client, e));
    }
};
export const conf = {
    name: 'setup-live-node',
    aliases: [],
    permLevel: 'Administrator',
};
export const help = {
    category: 'Pterodactyl',
    description: 'Sets up a live embed with node information',
    usage: 'setup-live-node <nodeId>',
};
