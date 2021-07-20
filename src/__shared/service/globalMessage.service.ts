import { Channel, Message, MessageEmbed, PartialMessage, TextChannel } from "discord.js";
import { client } from "../..";
import { Channels } from "../models/channels.model";

export async function sendNewGlobalMessage(msg: Message, channels: Channels): Promise<void> {
    if (msg.author.id == client.user?.id) return;
    let emebd = new MessageEmbed()
        .setTitle(msg.author.username)
        .setThumbnail(msg.author.displayAvatarURL({ dynamic: true }) + `?msgID=${msg.id}`)
        .setColor('#2F3136')
        .addField("\u200b", "**" + msg.content + "**")
        .addField("\u200b", "`🤖`" + `[Bot-Invite](${await client.generateInvite({ permissions: ["ADD_REACTIONS", "SEND_MESSAGES", "MANAGE_MESSAGES"] })}) ◊ ` + "`📍`[Server-Invite](https://twitch.tv/rocketment)")
        .setFooter(msg.guild?.name + ` (${msg.guild?.memberCount} User)`, msg.guild?.iconURL({ dynamic: true }) || "");

    if (msg.attachments.first()) emebd.setImage(msg.attachments.first()?.url || "");

    if (msg.reference?.messageID) {
        const ref = await (await client.channels.fetch(msg.reference.channelID) as TextChannel).messages.fetch(msg.reference.messageID);

        let data = {
            author: (ref.embeds[0]) ? ref.embeds[0].title : ref.author.username,
            content: (ref.embeds[0]) ? ref.embeds[0].fields[0].value : ref.content
        }
        emebd.setDescription(`
            reference to: ${data.author}
            > ${data.content}
        `);
    }

    for (let channel in channels) {
        if (channels[channel] != msg.channel.id) {

            client.channels.fetch(channels[channel]).then((channel: Channel) => {
                if (!channel || channel.type != "text") return;

                (channel as TextChannel).send(emebd).catch(() => { });
            }).catch(err => { });
        }
    }
}

export async function updateGlobalMessage(msg: Message | PartialMessage, channels: Channels): Promise<void> {
    for (let channelID in channels) {
        const channel = await client.channels.fetch(channels[channelID]).catch(err => { }) as TextChannel;
        if (channel) {
            channel.messages.fetch({ limit: 100 }).then(messages => {
                const myMessage: Message | undefined = messages.filter(message => message.embeds[0] && message.embeds[0].thumbnail?.url.split("?msgID=")[1] == msg.id).first();
                if (!myMessage) return;

                let embed = myMessage.embeds[0];

                embed.fields[0].value = "**"+ msg.content+ "**";

                myMessage.edit(embed);
            });
        }
    }
}

export async function deleteGlobalMessage(msg: Message | PartialMessage, channels: Channels): Promise<void> {
    for (let channelID in channels) {
        const channel = await client.channels.fetch(channels[channelID]).catch(err => { }) as TextChannel;

        if (channel) {
            channel.messages.fetch({ limit: 100 }).then(messages => {
                const myMessage: Message | undefined = messages.filter(message => message.embeds[0] && message.embeds[0].thumbnail?.url.split("?msgID=")[1] == msg.id).first();
                if (!myMessage) return;

                if(!myMessage.deletable) return;

                myMessage.delete();
            });
        }
    }
}