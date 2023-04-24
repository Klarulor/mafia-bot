import {ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalSubmitInteraction} from "discord.js";
import User from "../../Entities/User.entity";
import {ILangProps} from "../../types/interfaces/ILang";
import Role from "../../Entities/Role.entity";

module.exports.execute = async function (interaction: ModalSubmitInteraction, user: User, locale: ILangProps) {

    if (!user.premium) {
        interaction.reply({content: locale.error_premium, ephemeral: true})
        return;
    }
    const name = interaction.fields.getTextInputValue("conditionName");

    const buttons  = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setEmoji("💵")
                .setLabel(locale.condition_create_goNext_button)
                .setStyle(ButtonStyle.Success)
                .setCustomId("newconditionhalfbut" + name)
                .setDisabled(false),
        );
    await interaction.reply({content: locale.condition_create_goNext_message, ephemeral: true, components: [buttons]})

}