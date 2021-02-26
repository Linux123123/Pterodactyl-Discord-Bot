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
const discord_js_1 = require("discord.js");
const util_1 = require("util");
const glob_1 = __importDefault(require("glob"));
const enmap_1 = __importDefault(require("enmap"));
const jspteroapi_1 = __importDefault(require("@linux123123/jspteroapi"));
const logger_1 = __importDefault(require("../modules/logger"));
const functions_1 = __importDefault(require("../modules/functions"));
const globPromise = util_1.promisify(glob_1.default);
class Bot extends discord_js_1.Client {
    constructor() {
        super({ ws: { intents: discord_js_1.Intents.ALL } });
        this.commands = new enmap_1.default();
        this.aliases = new enmap_1.default();
        this.settings = new enmap_1.default('settings');
        this.levelCache = {};
        this.logger = logger_1.default;
        this.functions = functions_1.default;
    }
    async start(config) {
        this.config = config;
        this.login(config.token);
        this.app = new jspteroapi_1.default.Application(config.pteroHost, config.pteroToken);
        const commandFiles = await globPromise(`${__dirname}/../commands/*.js`);
        const eventFiles = await globPromise(`${__dirname}/../events/client/*.js`);
        commandFiles.map(async (value) => {
            this.functions.loadCommand(this, value);
        });
        eventFiles.map(async (eventFile) => {
            const ev = (await Promise.resolve().then(() => __importStar(require(eventFile))));
            this.logger(`Loading Event: ${ev.name}`);
            this.on(ev.name, ev.run.bind(null, this));
        });
        for (let i = 0; i < this.config.permLevels.length; i++) {
            const thisLevel = this.config.permLevels[i];
            this.levelCache[thisLevel.name] = thisLevel.level;
        }
    }
    embed(data) {
        return new discord_js_1.MessageEmbed({
            ...data,
        });
    }
}
exports.default = Bot;
