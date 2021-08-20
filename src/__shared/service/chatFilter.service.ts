import { Message } from "discord.js";
import * as fs from 'fs';
import { compareTwoStrings } from "string-similarity";
import { client } from "../..";


let lastMessages: any = {};

export async function chatfilter(msg: Message): Promise<boolean | undefined> {
    if (msg.author.bot) return;

    const content: string[] = msg.content
        .replace(/[.,\/#!?$%\^&\*;{}=\-_`~()]/g, "")
        .replace(/>/g, '> ')
        .split(' ')
    ;


    const filtered: boolean | undefined = await new Promise(async (resolve) => {
        if (checkForBlacklist(content.join(' '))) {
            sanction(msg, "watch your language!");
            resolve(true);
        }

        if(await checkForLink(msg)) {
            sanction(msg, "links are not allowed");
            resolve(true);
        }

        if(await checkSpam(msg, content)) {
            sanction(msg, "stop spamming!");
            resolve(true);
        }

        resolve(false);
    });

    if (filtered) return true;
    return false;
}

function checkForBlacklist(content: string): string | undefined {
    const blacklist: string[] = JSON.parse(fs.readFileSync(`${__dirname}/../data/wordBlacklist.json`, "utf-8").toString());
    // const whitelist: string[] = JSON.parse(fs.readFileSync('./data/filterWhitelist.json', "utf-8").toString());
    const whitelist: string[] = [];

    for (let item in blacklist) {
        content = content.split(' ').map(word => {
            if (whitelist.includes(word)) {
                return "/"
            }

            return word;
        }).join(' ');

        const result = content.replace(/ /g, '').replace(/\n/g, "").match(new RegExp(blacklist[item], 'gim'));
        const counter = content.replace(/\n/g, " ").split(' ').map(word => {
            return compareTwoStrings(word.toLowerCase(), blacklist[item]);
        });

        if (result?.length && result?.length > 0) return blacklist[item];
        if (counter[0] >= 0.60) return blacklist[item];
    };
}



async function checkForLink(msg: Message): Promise<boolean | undefined> {
    return await new Promise(resolve => {
        msg.content.split(' ').forEach((item: string) => {
            if (
                item.startsWith("https://") ||
                item.startsWith("http://") ||
                item.startsWith("www.") ||
                item.endsWith(".com") ||
                item.endsWith(".de") ||
                item.includes("discord.gg")
            ) {
                resolve(true);
                return;
            }
        });

        resolve(false);
    })
}


async function checkSpam(msg: Message, content: string[]): Promise<boolean | undefined> {
    if (!lastMessages[msg.author.id]) lastMessages[msg.author.id] = new Array();
    if (msg.author.bot) return;

    if (content.filter(word => word.match(/^(:[^:\s]+:|<:[^:\s]+:[0-9]+>|<a:[^:\s]+:[0-9]+>)+$/) || client.emojis.cache.filter(emoji => emoji.name == word)).length >= 8) sanction(msg, "too many emojis");

    if (lastMessages[msg.author.id].length >= 4) {
        if (Number.parseInt(lastMessages[msg.author.id][lastMessages[msg.author.id].length - 3][0]) + 5000 > Date.now()) {
            (await msg.channel.messages.fetch({ after: lastMessages[msg.author.id][lastMessages[msg.author.id].length - 4][1] })).filter(message => message.author.id == msg.author.id).forEach(message => message.delete().catch(err => {}));
            
            return true;
        }
    }

    lastMessages[msg.author.id].push([Date.now(), msg.id]);
}


export async function sanction(msg: Message, text: string): Promise<void> {
    await msg.reply(text).then(reply => {
        setTimeout(() => {
            reply.delete();
        }, 3000);
    });

    msg.delete().catch(err => {});
}