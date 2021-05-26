import { Client } from "discord.js";
import { readFileSync } from "fs";
import { success } from "../logger";
import { Config } from "../models/config.model";


export function onReady(client: Client): void {
    const config: Config = JSON.parse(readFileSync('./config.json', "utf-8").toString());
    if(!client.user) return;

    success(`Bot-Client online as: ${client.user.tag}`);
    
    client.user.setActivity({
        type: config.activity.type,
        name: `on ${client.guilds.cache.size} Guilds`
    });
}