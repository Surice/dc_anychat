import { Message, PartialMessage } from "discord.js"
import { readFileSync } from "fs";
import { updateGlobalMessage } from "../__shared/service/globalMessage.service";

export async function messageUpdate(oldMsg: Message | PartialMessage, msg: Message | PartialMessage): Promise<void> {
    if(msg.author?.bot) return;
    let channels: string[] = JSON.parse(readFileSync(`${__dirname}/../__shared/data/channels.json`, "utf-8").toString());

    if (channels.includes(msg.channel.id)) updateGlobalMessage(msg, channels);
}