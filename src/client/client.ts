import { Client, MessageEmbed, MessageEmbedOptions, Intents } from 'discord.js';
import { promisify } from 'util';
import glob from 'glob';
import enmap from 'enmap';
import pteroAPI, { Application } from '@linux123123/jspteroapi';
import Command from '../interfaces/Command';
import Event from '../interfaces/Event';
import Config, { permObject } from '../interfaces/Config';
import Logger from '../modules/logger';
import Functions from '../modules/functions';
import GuildSettings from '../interfaces/GuildSettings';

const globPromise = promisify(glob);

export default class Bot extends Client {
    public constructor() {
        super({ ws: { intents: Intents.ALL } });
    }
    public commands: enmap<string, Command> = new enmap();
    public aliases: enmap<string, string> = new enmap();
    public settings: enmap<string, GuildSettings> = new enmap('settings');
    public levelCache: { [key: string]: number } = {};
    public app!: Application;
    public logger = Logger;
    public config!: Config;
    public functions = Functions;
    public async start(config: Config): Promise<void> {
        this.config = config;
        this.login(config.token);
        this.app = new pteroAPI.Application(
            config.pteroHost,
            config.pteroToken,
        );
        const commandFiles: string[] = await globPromise(
            `${__dirname}/../commands/*.js`,
        );
        const eventFiles = await globPromise(
            `${__dirname}/../events/client/*.js`,
        );
        commandFiles.map(async (value: string) => {
            this.functions.loadCommand(this, value);
        });
        eventFiles.map(async (eventFile: string) => {
            const ev = (await import(eventFile)) as Event;
            this.logger(`Loading Event: ${ev.name}`);
            this.on(ev.name, ev.run.bind(null, this));
        });
        for (let i = 0; i < this.config.permLevels.length; i++) {
            const thisLevel: permObject = this.config.permLevels[i];
            this.levelCache[thisLevel.name] = thisLevel.level;
        }
    }
    public embed(data: MessageEmbedOptions): MessageEmbed {
        return new MessageEmbed({
            ...data,
        });
    }
}
