import { RunFunction } from '../interfaces/Command';

export const run: RunFunction = async (client, message) => {
    message.channel.send(
        client.embed(
            {
                title: client.config.pteroHost,
                url: client.config.pteroHost,
            },
            message
        )
    );
};
export const conf = {
    name: 'url',
    aliases: [''],
    permLevel: 'User',
};
export const help = {
    category: 'Pterodactyl',
    description: 'Gives the link to panel',
    usage: 'url',
};
