import { Message, PartialMessage } from "discord.js";
import { readFileSync } from "fs";
import { Channels } from "../__shared/models/channels.model";
import { deleteGlobalMessage } from "../__shared/service/globalMessage.service";

export async function messageDelete(msg: Message | PartialMessage) {
    if(msg.author?.bot) return;
    let channels: Channels = JSON.parse(readFileSync(`${__dirname}/../__shared/data/channels.json`, "utf-8").toString());

    if (channels[msg.guild?.id || ""] == msg.channel.id) deleteGlobalMessage(msg, channels);
}