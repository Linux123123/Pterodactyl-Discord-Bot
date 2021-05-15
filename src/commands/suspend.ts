import { RunFunction } from '../interfaces/Command';

export const run: RunFunction = async (client, message, args) => {
    if (!args[0])
        return message.reply('You need to provide the id of the server!');
    try {
        const res = await client.app.suspendServer(parseInt(args[0]));
        await message.delete();
        const msg = await message.channel.send(
            client.embed(
                {
                    title: res,
                },
                message
            )
        );
        msg.delete({ timeout: 3000 });
    } catch (e) {
        return message.reply(client.functions.handleCmdError(client, e));
    }
};
export const conf = {
    name: 'suspend',
    aliases: [''],
    permLevel: 'Administrator',
};
export const help = {
    category: 'Pterodactyl',
    description: 'Suspend a server',
    usage: 'suspend <server id>',
};
