import { Message, MessageEmbed } from "discord.js";
import { client, config } from "..";

export const info = {
    name: "Invite",
    description: "Invite command",
    argsRequired: false,
    admin: false,
    help: "use `"+ config.prefix+ "invite`"
}

export async function main(msg: Message, args: string[]): Promise<void> {
    msg.reply(new MessageEmbed()
        .setTitle("My Discord Invite")
        .setColor('#22FF22')
        .setDescription(`When **you** want to invite this **beautiful** Discord-Bot into **your** Server use this [__**Link**__](${await client.generateInvite({permissions: 8})}) to invite me!`)
        .addField("\u200b", `Allready **${client.guilds.cache.size}** guilds are using my chat and love it`)
        // .addField("Anybot", `If your looking for a good administration bot too have a look at [__**Anybot**__](https://feverest.de/anybot/home)`)
        .setThumbnail(client.user?.displayAvatarURL({dynamic: true, size: 2048}) ||"")
    );
}