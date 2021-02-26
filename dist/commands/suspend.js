"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.help = exports.conf = exports.name = exports.run = void 0;
const run = async (client, message, args) => {
    if (!args[0])
        return message.reply('You need to provide the id of the server!');
    try {
        const res = await client.app.suspendServer(parseInt(args[0]));
        await message.delete();
        const msg = await message.channel.send(client.embed({
            title: res,
            color: message.settings.embedColor,
            timestamp: new Date(),
        }));
        msg.delete({ timeout: 3000 });
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
exports.name = 'suspend';
exports.conf = {
    aliases: [''],
    permLevel: 'Administrator',
};
exports.help = {
    category: 'Pterodactyl',
    description: 'Suspend a server',
    usage: 'suspend <server id>',
};
