import { Message, TextChannel } from "discord.js";
import { readFileSync, writeFileSync } from "fs";
import { client, config } from "..";

export const info = {
    name: "Set Channel",
    description: "set the global chat channel",
    argsRequired: false,
    admin: true,
    help: "use `"+ config.prefix+ "invite`"
}

export async function main(msg: Message, args: string[]): Promise<void> {
    const channel = (msg.mentions.channels.first()) ? msg.mentions.channels.first() : await client.channels.fetch(args[0]);
    let channels: string[] = JSON.parse(readFileSync(`${__dirname}/../channels.json`, "utf-8").toString());

    if(!channel) {
        msg.reply("invalid channel");
        return;
    }

    if((channel as TextChannel).guild.id != msg.guild?.id) {
        msg.reply("not allowed");
        return;
    }

    if(channels.includes(channel.id)) {
        msg.reply("channel allready set");
        return;
    }

    channels.push(channel.id);

    writeFileSync(`${__dirname}/../channels.json`, JSON.stringify(channels));
    msg.react("✅");
}