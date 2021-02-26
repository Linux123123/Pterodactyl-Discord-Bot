"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.help = exports.conf = exports.name = exports.run = void 0;
const run = async (client, message) => {
    message.channel.send(client.embed({
        title: client.config.pteroHost,
        url: client.config.pteroHost,
        color: message.settings.embedColor,
        timestamp: new Date(),
    }));
};
exports.run = run;
exports.name = 'url';
exports.conf = {
    aliases: [''],
    permLevel: 'User',
};
exports.help = {
    category: 'Pterodactyl',
    description: 'Gives the link to panel',
    usage: 'url',
};
