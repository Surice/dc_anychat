import { Message, MessageEmbed } from "discord.js";
import { client, config } from "..";

export const info = {
    name: "Help",
    description: "Help command",
    argsRequired: false,
    admin: true,
    help: "use `"+ config.prefix+ "help`"
}

export async function main(msg: Message, args: string[]): Promise<void> {
    let embed = new MessageEmbed()
        .setColor('#22FF22')
        .setTitle(`Help - ${(await (msg.guild?.members.fetch(client.user || "")))?.nickname ? (await (msg.guild?.members.fetch(client.user || "")))?.nickname : client.user?.username}`)
        .setDescription("`< >` defines a required parameter and \n`[ ]` is an optional parameter")
        .setThumbnail(client.user?.displayAvatarURL({dynamic: true, size: 2048}) || "")
        .addFields([{
            name: "Help", value: "Displays this Message. \nuse `"+ config.prefix+"help`"
        }, {
            name: "Invite", value: "Shows the Invitelink for this Bot to add it to any server. \nuse `"+ config.prefix+"invite`"
        }, {
            name: "Set", value: "Add a Channel to the global chat. \nuse `"+ config.prefix+"set <#channel | channel_id>`"
        }, {
            name: "remove", value: "Removes a Channel from the global chat. \nuse `"+ config.prefix+"remove <#channel | channel_id>`"
        }])
}