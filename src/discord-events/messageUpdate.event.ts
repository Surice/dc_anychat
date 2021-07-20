import { Message, PartialMessage } from "discord.js"
import { readFileSync } from "fs";
import { Channels } from "../__shared/models/channels.model";
import { updateGlobalMessage } from "../__shared/service/globalMessage.service";

export async function messageUpdate(oldMsg: Message | PartialMessage, msg: Message | PartialMessage): Promise<void> {
    if(msg.author?.bot) return;
    let channels: Channels = JSON.parse(readFileSync(`${__dirname}/../__shared/data/channels.json`, "utf-8").toString());

    if (channels[msg.guild?.id || ""] == msg.channel.id) updateGlobalMessage(msg, channels);
}