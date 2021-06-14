import { Message } from "discord.js";
import { config } from "..";

export const info = {
    name: "Help",
    description: "Help command",
    argsRequired: false,
    admin: true,
    help: "use `"+ config.prefix+ "help`"
}

export async function main(msg: Message, args: string[]): Promise<void> {

}