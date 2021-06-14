import { Guild } from "discord.js";
import { client } from "..";

export function guildCreate(guild: Guild): void {
    client.user?.setActivity({
        type: "COMPETING",
        name: `${client.guilds.cache.size} Guilds`
    });
}