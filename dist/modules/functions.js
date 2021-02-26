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
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultSettings = void 0;
// THIS IS HERE BECAUSE SOME PEOPLE DELETE ALL THE GUILD SETTINGS
// And then they're stuck because the default settings are also gone.
// So if you do that, you're resetting your defaults. Congrats.
exports.defaultSettings = {
    prefix: '!',
    modLogChannel: 'mod-log',
    modRole: 'Moderator',
    adminRole: 'Administrator',
    systemNotice: 'true',
    embedColor: '#ff0000',
};
exports.default = {
    /* PERMISSION LEVEL FUNCTION */
    permlevel: (client, message) => {
        let permlvl = 0;
        const permOrder = client.config.permLevels
            .slice(0)
            .sort((p, c) => (p.level < c.level ? 1 : -1));
        while (permOrder.length) {
            const currentLevel = permOrder.shift();
            if (currentLevel.check(message)) {
                permlvl = currentLevel.level;
                break;
            }
        }
        return permlvl;
    },
    /* GUILD SETTINGS FUNCTION */
    // getSettings merges the client defaults with the guild settings. guild settings in
    // enmap should only have *unique* overrides that are different from defaults.
    getSettings: (client, guild) => {
        client.settings.ensure('default', exports.defaultSettings);
        if (!guild)
            return client.settings.get('default');
        const guildConf = client.settings.get(guild.id) || {};
        return { ...client.settings.get('default'), ...guildConf };
    },
    /*
    SINGLE-LINE AWAITMESSAGE
    const response = await client.awaitReply(msg, "Favourite Color?");
    msg.reply(`Oh, I really love ${response} too!`);
    */
    awaitReply: async (msg, question, limit = 60000) => {
        const filter = (m) => m.author.id === msg.author.id;
        await msg.channel.send(question);
        const collected = await msg.channel.awaitMessages(filter, {
            max: 1,
            time: limit,
            errors: ['time'],
        });
        return collected.first().content;
    },
    // Command loading
    loadCommand: async (client, commandName) => {
        try {
            client.logger(`Loading Command: ${commandName.split('/').pop()?.split('.')[0]}`);
            const props = await Promise.resolve().then(() => __importStar(require(commandName)));
            client.commands.set(props.name, props);
            props.conf.aliases.forEach((alias) => {
                client.aliases.set(alias, props.name);
            });
            return false;
        }
        catch (e) {
            client.logger(`Unable to load command ${commandName}: ${e}`, 'error');
            return e;
        }
    },
    unloadCommand: async (client, commandName) => {
        try {
            client.logger(`Unloading Command: ${commandName}`);
            let command;
            if (client.commands.has(commandName)) {
                command = client.commands.get(commandName);
            }
            else if (client.aliases.has(commandName)) {
                command = client.commands.get(client.aliases.get(commandName));
            }
            if (!command)
                return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;
            const mod = require.cache[require.resolve(`../commands/${command.name}`)];
            delete require.cache[require.resolve(`../commands/${command.name}.js`)];
            for (let i = 0; i < mod.parent.children.length; i++) {
                if (mod.parent.children[i] === mod) {
                    mod.parent.children.splice(i, 1);
                    break;
                }
            }
            return false;
        }
        catch (e) {
            client.logger(`Unable to unload command ${commandName}: ${e}`, 'error');
            return e;
        }
    },
};
