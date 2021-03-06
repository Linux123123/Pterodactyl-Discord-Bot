import { Guild, Message as DiscordMessage } from 'discord.js';
import { Bot } from './Client';
import { GuildSettings } from '../interfaces/GuildSettings';
import { User } from './User';

export class Message extends DiscordMessage {
    public settings!: GuildSettings;
    public client!: Bot;
    public guild!: Guild;
    public author!: User;
}
