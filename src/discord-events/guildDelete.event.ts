import { Guild } from "discord.js"
import { readFileSync, writeFileSync } from "fs";
import { Channels } from "../__shared/models/channels.model";

export function guildDelete(guild: Guild): void {
    let channels: Channels = JSON.parse(readFileSync(`${__dirname}/../__shared/data/channels.json`, "utf-8").toString());

    delete channels[guild.id];

    writeFileSync(`${__dirname}/../__shared/data/channels.json`, JSON.stringify(channels));
}