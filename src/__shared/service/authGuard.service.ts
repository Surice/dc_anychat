import { GuildMember } from "discord.js";
import { config } from "../..";

export async function authMember(member: GuildMember): Promise<boolean> {
    if(!member.permissions.has("ADMINISTRATOR") && member.id != config.owner) {
        return false;
    }

    return true;
}