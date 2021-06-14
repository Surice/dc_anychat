import { Client } from "discord.js";
import { readFileSync } from "fs";
import { success } from "../__shared/service/logger";
import { Config } from "../__shared/models/config.model";


export function onReady(client: Client): void {
    const config: Config = JSON.parse(readFileSync('./config.json', "utf-8").toString());
    if(!client.user) return;

    success(`Bot-Client online as: ${client.user.tag}`);
    
    client.user.setActivity({
        type: "COMPETING",
        name: `${client.guilds.cache.size} Guilds`
    });
}