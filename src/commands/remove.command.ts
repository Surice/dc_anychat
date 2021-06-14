import { Message } from "discord.js";
import { readFileSync, writeFileSync } from "fs";
import { client, config } from "..";

export const info = {
    name: "Set Channel",
    description: "set the global chat channel",
    argsRequired: false,
    admin: true,
    help: "use `"+ config.prefix+ "remove <#channel>`"
}

export async function main(msg: Message, args: string[]): Promise<void> {
    const channel = (msg.mentions.channels.first()) ? msg.mentions.channels.first() : await client.channels.fetch(args[0]);
    let channels: string[] = JSON.parse(readFileSync(`${__dirname}/../__shared/data/channels.json`, "utf-8").toString());

    if(!channel) {
        msg.reply("invalid channel");
        return;
    }

    if(!channels.includes(channel.id)) {
        msg.reply("channel not set as global chat");
        return;
    }

    const trash = channels.splice(channels.indexOf(channel.id), 1);

    writeFileSync(`${__dirname}/../__shared/data/channels.json`, JSON.stringify(channels));
    msg.react("✅");
}