"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.name = void 0;
exports.name = 'ready';
const run = async (client) => {
    client.logger(`${client.user?.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`, 'ready');
    client.user?.setActivity(`${client.settings.get('default')?.prefix}help`, {
        type: 'PLAYING',
    });
};
exports.run = run;
