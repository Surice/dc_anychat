import { Message, TextChannel } from "discord.js";
import { readFileSync, writeFileSync } from "fs";
import { client, config } from "..";
import { Channels } from "../__shared/models/channels.model";

export const info = {
    name: "Set Channel",
    description: "set the global chat channel",
    argsRequired: false,
    admin: true,
    help: "use `"+ config.prefix+ "set [#channel]`"
}

export async function main(msg: Message, args: string[]): Promise<void> {
    
    let channel = ((msg.mentions.channels.first()) ? msg.mentions.channels.first() : await client.channels.fetch(args[0]).catch(() => {})) as TextChannel;
    let channels: Channels = JSON.parse(readFileSync(`${__dirname}/../__shared/data/channels.json`, "utf-8").toString());

    if(!channel) {
        if(args[0]) {
            msg.reply("invalid channel");
            return;
        }

        channel = msg.channel as TextChannel;
    }

    if(channel.guild.id != msg.guild?.id || channel.type != "text") {
        msg.reply("not allowed");
        return;
    }

    if(channels[channel.guild.id] == channel.id) {
        msg.reply("channel allready set");
        return;
    }

    channels[channel.guild.id] = (channel.id);

    writeFileSync(`${__dirname}/../__shared/data/channels.json`, JSON.stringify(channels));
    msg.react("✅");
}