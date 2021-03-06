import { User as DiscordUser } from 'discord.js';

export class User extends DiscordUser {
    public level!: number;
    public levelName!: string;
}
