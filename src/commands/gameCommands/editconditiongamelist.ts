import {
    SelectMenuInteraction,
} from "discord.js";
import User from "../../Entities/User.entity";
import {ILangProps} from "../../types/interfaces/ILang";
import {curHostGames} from "../../index";
import PeacefulWin from "../../Classes/WinningConditions/PeacefulWin";
import KillerWIn from "../../Classes/WinningConditions/KillerWín";
import MafiaWin from "../../Classes/WinningConditions/MafiaWin";
import WinningCondition from "../../Entities/WinningCondition.entity";
import CustomWin from "../../Classes/WinningConditions/CustomWin";

export default async function editconditiongamelist(interaction: SelectMenuInteraction, user: User, locale: ILangProps) {
    try {
        let gameid = +interaction.values[0].split('%')[0];
        if (curHostGames.has(gameid)) {
            const host = curHostGames.get(gameid);
            if (host.author == interaction.user.id) {
                // if (!user.premium) {
                //     interaction.reply("You don't have premium to change game preset");
                //     return;
                // }
                host.conditions = [];
                for (let condition of interaction.values) {
                    let conditionId = condition.split('%')[1];
                    switch (conditionId){
                        case new PeacefulWin().Name:{
                            host.conditions.push(new PeacefulWin());
                            break;
                        }
                        case new MafiaWin().Name:{
                            host.conditions.push(new MafiaWin());
                            break;
                        }
                        case new KillerWIn().Name:{
                            host.conditions.push(new KillerWIn());
                            break;
                        }
                        default: {
                            if (!user.premium) {
                                break;
                            }
                            const custCond = await WinningCondition.findOne({where: {id: +conditionId}, relations: ["user"]});
                            if (custCond == null) {
                                break;
                            }
                            if (custCond.user.userid != user.userid) {
                                break;
                            }
                            host.conditions.push(new CustomWin(
                                custCond.name,
                                custCond.condition,
                                custCond.embedTitle,
                                custCond.embedDescription,
                                custCond.embedThumbnail,
                                custCond.winRole
                            ));
                            break;
                        }
                    }
                }
                let winStr = "";
                let roleStr = "";
                for (let role of host.roles){
                    roleStr += "\`\`" + role.GetRoleName(user.lang) + "\`\`\n";
                }
                for(let win of host.conditions){
                    winStr += "\`\`" + win.GetName(user.lang) + "\`\`\n";
                }
                host.embed.setFields([
                    {
                        value: roleStr,
                        name: `__**${locale.game_created_roles}**__`
                    },
                    {
                        value: winStr,
                        name: `__**${locale.game_created_gameEndConditions}**__`
                    }]);
                curHostGames.set(gameid, host);
                await host.interaction.editReply({embeds: [host.embed]});
                await interaction.reply({content: locale.game_edit_success_message, ephemeral: true}).catch();
            } else {
                interaction.reply({content: locale.game_start_error_noAccess, ephemeral: true}).catch(() => {
                });
            }
        } else {
            interaction.reply({content: locale.game_error_incorrectGameID, ephemeral: true}).catch(() => {
            });
        }
    } catch (err) {
        interaction.reply({content: err, ephemeral: true}).catch();
    }
}