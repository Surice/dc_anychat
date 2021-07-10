import { Message } from "discord.js";
import { readFileSync, writeFileSync } from "fs";
import { client, config } from "..";
import { Channels } from "../__shared/models/channels.model";

export const info = {
    name: "Set Channel",
    description: "Removes the globalchat from your guild",
    argsRequired: false,
    admin: true,
    help: "use `"+ config.prefix+ "remove`"
}

export async function main(msg: Message, args: string[]): Promise<void> {
    let channels: Channels = JSON.parse(readFileSync(`${__dirname}/../__shared/data/channels.json`, "utf-8").toString());

    if(!channels[msg.guild?.id || ""]) {
        msg.reply("Guild has no globalchat");
        return;
    }

    delete channels[msg.guild?.id || ""];

    writeFileSync(`${__dirname}/../__shared/data/channels.json`, JSON.stringify(channels));
    msg.react("✅");
}