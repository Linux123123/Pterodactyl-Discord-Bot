"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.help = exports.conf = exports.name = exports.run = void 0;
const run = async (client, message, args, level) => {
    const friendly = client.config.permLevels.find((l) => l.level === level)?.name;
    message.reply(`Your permission level is: ${level} - ${friendly}`);
};
exports.run = run;
exports.name = 'mylevel';
exports.conf = {
    aliases: [],
    permLevel: 'User',
};
exports.help = {
    category: 'Miscelaneous',
    description: 'Tells you your permission level for the current message location.',
    usage: 'mylevel',
};
