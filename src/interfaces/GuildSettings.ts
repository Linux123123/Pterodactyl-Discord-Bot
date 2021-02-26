export default interface GuildSettings {
    [prefix: string]: string;
    modLogChannel: string;
    modRole: string;
    adminRole: string;
    systemNotice: string;
    embedColor: string;
}
