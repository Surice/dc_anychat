import { Guild } from "discord.js"
import { readFileSync, writeFileSync } from "fs";

export function guildDelete(guild: Guild): void {
    let channels: string[] = JSON.parse(readFileSync(`${__dirname}/../channels.json`, "utf-8").toString()),
        trash: string[] = new Array();

    guild.channels.cache.forEach(channel =>  {
        if(channels.indexOf(channel.id)) trash = channels.splice(channels.indexOf(channel.id), 1);
    });

    writeFileSync(`${__dirname}/../channels.json`, JSON.stringify(channels));
}