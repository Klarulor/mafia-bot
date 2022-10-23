import IUserProps from "../../types/interfaces/IUser";
import {ActionRowBuilder, RestOrArray, SelectMenuBuilder, SelectMenuOptionBuilder} from "discord.js";

export default function getVoteRow(users: IUserProps[], unactive = false){
    const filterUsers = users.filter(item=> item.isKilled === false);
    const chooseArr: RestOrArray<SelectMenuOptionBuilder> = [];
    const skip = new SelectMenuOptionBuilder()
        .setLabel("Пропустить голосование")
        .setEmoji("▶️")
        .setValue("skip_vote");
    chooseArr.push(skip);
    const Emojis: string[] = ['🗳️', '📄', '✒️', '🖋', '⏱'];

    for (let user of filterUsers){
        const chooser = new SelectMenuOptionBuilder()
            .setLabel(user.userTag)
            .setEmoji(Emojis[Math.floor(Math.random() * Emojis.length)])
            .setValue(user.userid);
        chooseArr.push(chooser);
    }
    const row = new ActionRowBuilder<SelectMenuBuilder>()
        .addComponents(
            new SelectMenuBuilder()
                .setCustomId("vote_select")
                .setPlaceholder('Выберите против кого вы голосуете...')
                .setMinValues(1)
                .setMaxValues(1)
                .addOptions(chooseArr)
                .setDisabled(unactive),
        );
    return row;
}
