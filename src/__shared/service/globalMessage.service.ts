import { Channel, Message, MessageEmbed, PartialMessage, TextChannel } from "discord.js";
import { client } from "../..";

export async function sendNewGlobalMessage(msg: Message, channels: string[]): Promise<void> {
    if (msg.author.id == client.user?.id) return;
    let emebd = new MessageEmbed()
        .setTitle(msg.author.username)
        .setThumbnail(msg.author.displayAvatarURL({ dynamic: true })+ `?msgID=${msg.id}`)
        .setColor('#2F3136')
        .setDescription(msg.content)
        .addField("\u200b", "`🤖`"+ `[Bot-Invite](${await client.generateInvite({permissions: ["ADD_REACTIONS","SEND_MESSAGES","MANAGE_MESSAGES"]})}) ◊ `+ "`📍`[Server-Invite](https://twitch.tv/rocketment)")
        .setFooter(msg.guild?.name+ ` (${msg.guild?.members.cache.size} User)`, msg.guild?.iconURL({dynamic: true}) || "");

    if (msg.attachments.first()) emebd.setImage(msg.attachments.first()?.url || "");

    channels.forEach(async channel => {
        client.channels.fetch(channel).then((channel: Channel) => {
            if(!channel || channel.type != "text") return;

            (channel as TextChannel).send(emebd).catch(() => { });
        }).catch(err => {});
    });

    msg.delete();
}

export async function updateGlobalMessage(msg: Message | PartialMessage, channels: string[]): Promise<void> {
    channels.forEach(async (channelID: string) => {
        const channel = await client.channels.fetch(channelID).catch(err => {}) as TextChannel;
        if(!channel) return;

        channel.messages.fetch({limit: 100}).then(messages => {
            const myMessage: Message | undefined = messages.filter(message => message.embeds[0] && message.embeds[0].thumbnail?.url.split("?msgID=")[1] == msg.id).first();
            if(!myMessage) return;

            let embed = myMessage.embeds[0];

            embed.setDescription(msg.content);

            myMessage.edit(embed);
        });
    });
}