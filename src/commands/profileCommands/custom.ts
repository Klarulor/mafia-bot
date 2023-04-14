import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChatInputCommandInteraction,
    EmbedBuilder, RestOrArray, SelectMenuBuilder, SelectMenuOptionBuilder
} from "discord.js";
import User from "../../Entities/User.entity";
import {ILangProps} from "../../types/interfaces/ILang";

module.exports.execute = async function (interaction: ButtonInteraction, user: User, locale: ILangProps) {

    if(!user.premium){
        interaction.reply({content: "You don't have premium to create custom roles and conditions, sorry!", ephemeral: true})
        return;
    }

    const buttons  = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setEmoji("💵")
                .setLabel("Delete Role")
                .setStyle(ButtonStyle.Danger)
                .setCustomId("deleterole")
                .setDisabled(false),
            new ButtonBuilder()
                .setEmoji("🧐")
                .setLabel("Create Role")
                .setStyle(ButtonStyle.Success)
                .setCustomId("createrole")
                .setDisabled(false),
            new ButtonBuilder()
                .setEmoji("🧐")
                .setLabel("Edit Role")
                .setStyle(ButtonStyle.Primary)
                .setCustomId("editrole")
                .setDisabled(false),

        );
    const buttons2  = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setEmoji("💵")
                .setLabel("Delete Condition")
                .setStyle(ButtonStyle.Danger)
                .setCustomId("deletecondition")
                .setDisabled(false),
            new ButtonBuilder()
                .setEmoji("🧐")
                .setLabel("Create Condition")
                .setStyle(ButtonStyle.Success)
                .setCustomId("createcondition")
                .setDisabled(false),
            new ButtonBuilder()
                .setEmoji("🧐")
                .setLabel("Edit Condition")
                .setStyle(ButtonStyle.Primary)
                .setCustomId("editcondition")
                .setDisabled(false),

        );


    if(user.customRoles.length > 0){
        const chooseArr: RestOrArray<SelectMenuOptionBuilder> = [];
        for (let role of user.customRoles){
            const roleOption = new SelectMenuOptionBuilder()
                .setLabel(role.name)
                .setValue("viewrole"  + String(role.id));
            chooseArr.push(roleOption)
        }
        const row = new ActionRowBuilder<SelectMenuBuilder>()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId("viewrole")
                    .setPlaceholder('choose role to view')
                    .setMinValues(1)
                    .setMaxValues(1)
                    .addOptions(chooseArr)
            );
        interaction.reply({content: "Choose action", components: [buttons, buttons2, row], ephemeral: true});
    }else{
        interaction.reply({content: "Choose action", components: [buttons, buttons2], ephemeral: true});
    }




}