import { version } from 'discord.js';
import moment from 'moment';
import { RunFunction } from '../interfaces/Command';
import('moment-duration-format');

export const run: RunFunction = async (client, message) => {
    const duration = moment
        .duration(client.uptime)
        .format(' D [days], H [hrs], m [mins], s [secs]');
    message.channel.send(
        client.embed({
            title: 'Stats',
            fields: [
                {
                    name: 'Mem usage',
                    value: `${(
                        process.memoryUsage().heapUsed /
                        1024 /
                        1024
                    ).toFixed(2)} MB`,
                    inline: true,
                },
                {
                    name: 'Uptime',
                    value: duration,
                    inline: true,
                },
                {
                    name: 'Users',
                    value: (client.users.cache.size - 1).toLocaleString(),
                    inline: true,
                },
                {
                    name: 'Servers',
                    value: client.guilds.cache.size.toLocaleString(),
                    inline: true,
                },
                {
                    name: 'Channels',
                    value: client.channels.cache.size.toLocaleString(),
                    inline: true,
                },
                {
                    name: 'Discord.js',
                    value: `v${version}`,
                    inline: true,
                },
                {
                    name: 'Node',
                    value: process.version,
                    inline: true,
                },
            ],
            color: message.settings.embedColor,
            timestamp: new Date(),
        }),
    );
};
export const name = 'stats';

export const conf = {
    aliases: [],
    permLevel: 'User',
};

export const help = {
    category: 'Miscelaneous',
    description: 'Gives some useful bot statistics',
    usage: 'stats',
};
