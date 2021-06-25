import { Channel, Message, MessageEmbed, TextChannel } from "discord.js";
import { readFileSync, readdirSync } from "fs";
import { client, config } from "..";
import { error } from "../__shared/service/logger";
import { authMember } from "../__shared/service/authGuard.service";
import { sendNewGlobalMessage } from "../__shared/service/globalMessage.service";

let commands = new Array();

export async function onMessage(msg: Message): Promise<void> {
    if (!msg.author) {
        error("unknown User", "msg event");
        console.log(msg.author);
        return;
    }
    if (msg.webhookID || msg.author.bot) return;
    if(msg.channel.type != "text") return;

    let channels: string[] = JSON.parse(readFileSync(`${__dirname}/../__shared/data/channels.json`, "utf-8").toString());


    const checkCommand = await checkForCommand(msg);
    if (checkCommand) return;

    if (channels.includes(msg.channel.id)) sendNewGlobalMessage(msg, channels);
}

async function checkForCommand(msg: Message): Promise<boolean | undefined> {
    if (!msg.content.startsWith(config.prefix)) return;


    const commandName = msg.content.split(' ')[0].slice(config.prefix.length).toLocaleLowerCase(),
        args = msg.content.split(' ').slice(1);


    collectCommands();

    if (!commands.find(command => command.name == commandName)) {
        msg.reply("command not found");
        return;
    }

    let command = require(`../commands/${commandName}.command`);

    if(!msg.member) return;
    const auth = authMember(msg.member);

    if (command.admin && !auth) {
        msg.reply("unauthorized");
        return
    };

    if (!args[0] && command.info.argsRequired) {
        msg.reply(command.info.help);
    } else {
        try {
            command.main(msg, args);
        } catch (err) {
            msg.reply("command broken");
            error(err.code);
        }
        return true;
    }
}


function collectCommands(): void {
    const files = readdirSync(`${__dirname}/../commands/`, { withFileTypes: true });

    files.forEach(file => {
        commands.push({
            name: file.name.split('.')[0]
        });
    });
}