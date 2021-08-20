import { Channel, Message, MessageEmbed, PartialMessage, TextChannel, User } from "discord.js";
import { client } from "../..";
import { Channels } from "../models/channels.model";
import { chatfilter } from "./chatFilter.service";

export async function sendNewGlobalMessage(msg: Message, channels: Channels): Promise<void> {
    if (msg.author.id == client.user?.id) return;
    if(await chatfilter(msg)) return;

    let embed = new MessageEmbed()
        .setTitle(msg.author.username)
        .setThumbnail(msg.author.displayAvatarURL({ dynamic: true }) + `?msgID=${msg.id}&channelID=${msg.channelId}`)
        .setColor('#2F3136')
        .addField("\u200b", "**" + msg.content + "**")
        .addField("\u200b", "`🤖`" + `[Bot-Invite](${client.generateInvite({ scopes: ["bot"], permissions: ["ADD_REACTIONS", "SEND_MESSAGES", "MANAGE_MESSAGES", "USE_EXTERNAL_EMOJIS", "EMBED_LINKS", "READ_MESSAGE_HISTORY"] })}) ◊ ` + "`📍`[Server-Invite](https://twitch.tv/rocketment)")
        .setFooter(msg.guild?.name + ` (${msg.guild?.memberCount} User)`, msg.guild?.iconURL({ dynamic: true }) || "");

    if (msg.attachments.first()) embed.setImage(msg.attachments.first()?.url || "");

    if (msg.reference?.messageId) {
        const ref = await (await client.channels.fetch(msg.reference.channelId) as TextChannel).messages.fetch(msg.reference.messageId);
        // const baseMessage: Message = await (await client.channels.fetch(ref.embeds[0].thumbnail?.url.split("&channelID=")[1] as string) as TextChannel).messages.fetch(ref.embeds[0].thumbnail?.url.split("?msgID=")[1].split("&")[0] as string);

        let data = {
            author: (ref.embeds[0]) ? ref.embeds[0].title : ref.author.id,
            content: (ref.embeds[0]) ? ref.embeds[0].fields[0].value : ref.content
        }
        embed.setDescription(`
            reference to: <@${data.author}>
            > ${data.content}
        `);
    }

    for (let channel in channels) {
        if (channels[channel] != msg.channel.id) {
            
            client.channels.fetch(channels[channel]).then((channel: Channel | null) => {
                if (!channel || channel.type != "GUILD_TEXT") return;

                (channel as TextChannel).send({embeds: [embed]}).catch((err) => { console.log(err)});
            }).catch(err => { });
        }
    }
}

export async function updateGlobalMessage(msg: Message | PartialMessage, channels: Channels): Promise<void> {
    for (let channelID in channels) {
        const channel = await client.channels.fetch(channels[channelID]).catch(err => { }) as TextChannel;
        if (channel) {
            channel.messages.fetch({ limit: 100 }).then(messages => {
                const myMessage: Message | undefined = messages.filter(message => message.embeds[0] && message.embeds[0].thumbnail?.url.split("?msgID=")[1].split("&")[0] == msg.id).first();
                if (!myMessage) return;

                let embed = myMessage.embeds[0];

                embed.fields[0].value = "**"+ msg.content+ "**";

                myMessage.edit({embeds: [embed]});
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