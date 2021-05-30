import { Message, MessageEmbed, TextChannel } from "discord.js";
import { readFileSync, readdirSync } from "fs";
import { client } from "..";
import { error } from "../logger";
import { Config } from "../models/config.model";

const config: Config = JSON.parse(readFileSync('./config.json', "utf-8").toString());

let commands = new Array();

export async function onMessage(msg: Message): Promise<void> {
    if(!msg.author) {
        error("unknown User", "msg event");
        console.log(msg.author);
        return;
    }
    if(msg.webhookID) return;

    let channels: string[] = JSON.parse(readFileSync(`${__dirname}/../channels.json`, "utf-8").toString());


    const check = await checkForCommand(msg);
    if(check) return;

    if(channels.includes(msg.channel.id)) sendMessage(msg, channels);
}

async function checkForCommand(msg: Message): Promise<boolean | undefined> {
    if(!msg.content.startsWith(config.prefix)) return;


    let commandName = msg.content.split(' ')[0].slice(config.prefix.length).toLocaleLowerCase();
    const args = msg.content.split(' ').slice(1).join(' ');


    collectCommands();

    if(!commands.find(command => command.name == commandName)) {
        msg.reply("command not found");
        return;
    }

    let command = require(`../commands/${commandName}.command`);

    if(command.admin && !msg.member?.permissions.has('ADMINISTRATOR')) {
        msg.reply("unauthorized");
        return
    };

    if(!args[0] && command.info.argsRequired) {
        msg.reply(command.info.help);
    } else {
        try{
            command.main(msg, args);
        } catch(err) {
            msg.reply("command broken");
            error(err.code);
        }
        return true;
    }
}


function collectCommands(): any {
    const files = readdirSync(`${__dirname}/../commands/`, {withFileTypes: true});
    
    files.forEach(file => {
        commands.push({
            name: file.name.split('.')[0]
        });
    });
}


function sendMessage(msg: Message, channels: string[]) {
    if(msg.author.id == client.user?.id) return;
    let emebd = new MessageEmbed()
        .setAuthor(`${msg.author.tag} (${msg.guild?.name})`, msg.author.displayAvatarURL({dynamic: true}))
        .setColor('#3510FA')
        .setDescription(msg.content);

    if(msg.attachments.first()) emebd.setImage(msg.attachments.first()?.url || "");

    channels.forEach(async channel => {
        if(channel == msg.channel.id) return;

        (await client.channels.fetch(channel) as TextChannel).send(emebd).catch(() => { });
    });
}