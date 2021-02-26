"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.help = exports.conf = exports.name = exports.run = void 0;
const discord_js_1 = require("discord.js");
const moment_1 = __importDefault(require("moment"));
Promise.resolve().then(() => __importStar(require('moment-duration-format')));
const run = async (client, message) => {
    const duration = moment_1.default
        .duration(client.uptime)
        .format(' D [days], H [hrs], m [mins], s [secs]');
    message.channel.send(client.embed({
        title: 'Stats',
        fields: [
            {
                name: 'Mem usage',
                value: `${(process.memoryUsage().heapUsed /
                    1024 /
                    1024).toFixed(2)} MB`,
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
                value: `v${discord_js_1.version}`,
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
    }));
};
exports.run = run;
exports.name = 'stats';
exports.conf = {
    aliases: [],
    permLevel: 'User',
};
exports.help = {
    category: 'Miscelaneous',
    description: 'Gives some useful bot statistics',
    usage: 'stats',
};
