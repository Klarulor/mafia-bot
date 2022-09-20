import {ChatInputCommandInteraction, Client, EmbedBuilder, GatewayIntentBits, Interaction, Partials} from "discord.js";
import MafiaGame from "./types/game";
import HostGame from "./types/host";
import User from "./types/user";
import {Roles} from "./types/roles";
import MafiaEmbedBuilder from "./Classes/MafiaEmbedBuilder";
import getMafiaRow from "./Functions/SelectRows/getMafiaRow";
import getDoctorRow from "./Functions/SelectRows/getDoctorRow";
import getPoliceRow from "./Functions/SelectRows/getPoliceRow";
import getVoteRow from "./Functions/SelectRows/getVoteRow";
import endChooseMoveHandler from "./Functions/endChooseMoveHandler";
import getKillerRow from "./Functions/SelectRows/getKillerRow";
import * as dotenv from 'dotenv'
dotenv.config()
const TOKEN = process.env.TOKEN;

export const discordBot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Channel
    ]
});

export const curHostGames: Map<number, HostGame> = new Map();
export const curHandlingGames: Map<number, MafiaGame> = new Map();

discordBot.on('interactionCreate', async (interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
        if (interaction.channel.isDMBased())
            interaction.reply({content:'Создать игру в мафию вы можете только на сервере!', ephemeral: true});
        const {commandName} = interaction;
        const commandObj = require(`./commands/${commandName}`);
        commandObj.execute(interaction);
    } else if (interaction.isSelectMenu()) {
        let game: MafiaGame | null = null;
        let user: User | null = null;
        for (let v of curHandlingGames.values()) {
            if (v.users.filter((item: User) => item.userid === interaction.user.id).length > 0) {
                game = v;
                user = v.users.filter((item: User) => item.userid === interaction.user.id)[0];
            }
        }
        if (user || game) {
            if (user.isKilled) {
                interaction.reply({content:"Вы мертв", ephemeral: true});
                return;
            }
            const msgCon = interaction.values[0];
            try {
                switch (game.stage) {
                    case "chossing": {
                        switch (user.role) {
                            case Roles.MAFIA: {
                                if (game.users.filter(item => item.isKilled === false).filter(item => msgCon == item.userid).length > 0 && game.votedToCheck.mafia.filter(item => item.mafia == user.userid).length === 0) {
                                    let userMafiaSelect = game.users.filter((item) => msgCon == item.userid)[0];
                                    game.votedToCheck.mafia.push({mafia: user.userid, target: userMafiaSelect.userid});
                                    interaction.reply(`Вы выбрали ${userMafiaSelect.userTag}!`);
                                    interaction.message.delete();
                                    game = endChooseMoveHandler(game);
                                    if (!game.finished)
                                        curHandlingGames.set(game.id, game);
                                } else {
                                    interaction.reply({content: `Вы уже выбрали!`, ephemeral: true});
                                }
                                break;
                            }
                            case Roles.POLICE: {
                                if (game.users.filter(item => item.isKilled === false).filter(item => msgCon == item.userid).length > 0 && game.votedToCheck.police === null) {
                                    let userSel: User;
                                    game.users.map((item) => msgCon == item.userid ? userSel = item : null);
                                    interaction.reply(`Pоль ${userSel.userTag} - ${userSel.role === Roles.MAFIA ? "мафия" : "не мафия"}`);
                                    interaction.message.delete();
                                    game.votedToCheck.police = userSel.userid;
                                    game = endChooseMoveHandler(game);
                                    if (!game.finished)
                                        curHandlingGames.set(game.id, game);
                                } else {
                                    interaction.reply({content: `Вы уже выбрали!`, ephemeral: true})
                                }
                                break;
                            }
                            case Roles.DOCTOR: {
                                if (game.users.filter(item => item.isKilled === false).filter(item => msgCon == item.userid).length > 0 && game.votedToCheck.doctor === null) {
                                    let userSel: User;
                                    game.users.map((item, index) => msgCon == item.userid ? userSel = item : null);
                                    interaction.reply(`${userSel.userTag} будет вылечен!`);
                                    interaction.message.delete();
                                    game.votedToCheck.doctor = userSel.userid;
                                    game = endChooseMoveHandler(game);
                                    if (!game.finished)
                                        curHandlingGames.set(game.id, game);
                                } else {
                                    interaction.reply({content: `Вы уже выбрали!`, ephemeral: true});
                                }
                                break;
                            }
                            case Roles.KILLER: {
                                if (game.users.filter(item => item.isKilled === false).filter(item => msgCon == item.userid).length > 0 && game.votedToCheck.killer === null) {
                                    let userSel: User;
                                    game.users.map((item, index) => msgCon == item.userid ? userSel = item : null);
                                    interaction.reply(`Вы выбрали что хотите убить ${userSel.userTag}!`);
                                    interaction.message.delete();
                                    game.votedToCheck.killer = userSel.userid;
                                    game = endChooseMoveHandler(game);
                                    if (!game.finished)
                                        curHandlingGames.set(game.id, game);
                                } else {
                                    interaction.reply({content: `Вы уже выбрали!`, ephemeral: true});
                                }

                                break;
                            }
                        }

                        break;
                    }
                    case "discussion": {

                        if (game.users.filter(item => item.isKilled === false).filter(item => msgCon == item.userid).length > 0 || msgCon == "skip_vote") {
                            if (msgCon != "skip_vote") {
                                let userSel: User;
                                game.users.map((item) => msgCon == item.userid ? userSel = item : null);
                                if (game.votedToKick.filter(item => item.userid === interaction.user.id).length !== 0) {
                                    interaction.reply({content:'Вы уже проголосовали', ephemeral: true});
                                    return;
                                } else {
                                    game.votedToKick.push({
                                        userid: interaction.user.id,
                                        forwhom: userSel.userid
                                    });
                                    interaction.reply("Вы успешно проголосовали");
                                    interaction.message.delete();
                                }

                            } else {
                                if (game.votedToKick.filter(item => item.userid === interaction.user.id).length !== 0) {
                                    interaction.reply({content:'Вы уже проголосовали', ephemeral: true});
                                    return;
                                } else {
                                    game.votedToKick.push({
                                        userid: interaction.user.id,
                                        forwhom: "skip_vote"
                                    });
                                    interaction.reply("Вы успешно проголосовали");
                                    interaction.message.delete();
                                }

                            }


                            if (game.votedToKick.length === game.users.filter(item => item.isKilled === false).length) {

                                let votedForUsers: Array<{ userid: string; numbersOfVotes: number; tag: string; }> = [];
                                game.users.filter(item => item.isKilled === false).map(item => {
                                    votedForUsers.push({
                                        tag: item.userTag,
                                        userid: item.userid,
                                        numbersOfVotes: game.votedToKick.filter(vote => vote.forwhom === item.userid).length
                                    });
                                });
                                votedForUsers.push({
                                    tag: "скип",
                                    userid: 'skip',
                                    numbersOfVotes: game.votedToKick.filter(vote => vote.forwhom === "skip_vote").length
                                })
                                votedForUsers = votedForUsers.sort((item, item2) => item2.numbersOfVotes - item.numbersOfVotes);
                                const voteEmded = new EmbedBuilder();
                                voteEmded.setColor(0xa4fd8a);
                                voteEmded.setTitle("Результаты голосования")
                                let votes: string = "";
                                for (let value of votedForUsers) {
                                    votes += value.tag + ": " + value.numbersOfVotes + "\n"
                                }
                                voteEmded.setDescription(votes);
                                game.users.map(item => {
                                    discordBot.users.fetch(item.userid).then(async user => {
                                        const dm = user?.dmChannel ?? await user.createDM();
                                        dm.send({embeds: [voteEmded]});
                                    });
                                });
                                game.votedToKick = [];
                                if (votedForUsers[0].numbersOfVotes === votedForUsers[1].numbersOfVotes || votedForUsers[0].userid == "skip") {
                                    game.users.map(item => {
                                        discordBot.users.fetch(item.userid).then(async user => {
                                            const dm = user?.dmChannel ?? await user.createDM();
                                            dm.send(`Выбрать никого не удалось или произошел пропуск голосования`);
                                        });
                                    });
                                } else {
                                    let curVoted = votedForUsers[0];
                                    let indexOfVotedFor: number;
                                    game.users.map((item, index) => item.userid == curVoted.userid ? indexOfVotedFor = index : null);
                                    game.users[indexOfVotedFor].isKilled = true;
                                    if (game.users.filter(user => user.role === Roles.MAFIA).filter(mafia => mafia.isKilled === false).length === 0 && game.users.filter(user => user.role === Roles.KILLER).filter(killer => killer.isKilled === false).length === 0) {
                                        game.users.map(item => {
                                            discordBot.users.fetch(item.userid).then(async user => {
                                                const dm = user?.dmChannel ?? await user.createDM();
                                                dm.send({embeds: [MafiaEmbedBuilder.peacefulWin()]});
                                                curHandlingGames.delete(game.id);
                                            });
                                        });
                                        return;
                                    }
                                    const alive = game.users.filter(item => item.isKilled == false);
                                    if (game.users.length > 7 && game.users.filter(item => item.role === Roles.KILLER)[0]?.isKilled === false && alive.length < 3) {
                                        game.users.map(item => {
                                            discordBot.users.fetch(item.userid).then(async user => {
                                                const dm = user?.dmChannel ?? await user.createDM();
                                                dm.send({embeds: [MafiaEmbedBuilder.killerWin(game.users.filter(item => item.role === Roles.KILLER)[0].userTag)]});
                                            });
                                            curHandlingGames.delete(game.id);
                                            return;
                                        });
                                    } else if (alive.length < alive.filter(item => item.role == Roles.MAFIA).length * 2 + 1) {
                                        game.users.map(item => {
                                            discordBot.users.fetch(item.userid).then(async user => {
                                                const dm = user?.dmChannel ?? await user.createDM();
                                                dm.send({embeds: [MafiaEmbedBuilder.mafiaWin(game.users.filter(item => item.role === Roles.MAFIA))]});
                                            });
                                        });
                                        curHandlingGames.delete(game.id);
                                        return;
                                    }
                                }
                                game.stage = 'chossing';
                                game.day++;
                                game.votedToCheck = {
                                    mafia: [],
                                    doctor: game.users.filter(item => item.role == Roles.DOCTOR)[0].isKilled ? "noDoctor" : null,
                                    police: game.users.filter(item => item.role == Roles.POLICE)[0].isKilled ? "noPolice" : null,
                                    mistress: "noMistress",
                                    beautiful: "noBeautiful",
                                    killer: game.users.length > 7 ? game.users.filter(item => item.role == Roles.KILLER)[0].isKilled ? "noKiller" : null : "noKiller"
                                }
                                game.users.map(item => {
                                    discordBot.users.fetch(item.userid).then(async user => {
                                        const dm = user?.dmChannel ?? await user.createDM();
                                        dm.send({embeds: [MafiaEmbedBuilder.sleepTime()]});
                                    });
                                });
                                discordBot.users.fetch(game.users.filter(item => item.role === Roles.MAFIA && item.isKilled === false)[0].userid).then(async user => {
                                    const dm = user?.dmChannel ?? await user.createDM();
                                    dm.send({components: [getMafiaRow(game.users)]});
                                });
                                if (game.users.filter(item => item.role === Roles.DOCTOR && item.isKilled === false).length > 0)
                                    discordBot.users.fetch(game.users.filter(item => item.role === Roles.DOCTOR && item.isKilled === false)[0].userid).then(async user => {
                                        const dm = user?.dmChannel ?? await user.createDM();
                                        dm.send({components: [getDoctorRow(game.users)]});
                                    });
                                if (game.users.filter(item => item.role === Roles.POLICE && item.isKilled === false).length > 0)
                                    discordBot.users.fetch(game.users.filter(item => item.role === Roles.POLICE && item.isKilled === false)[0].userid).then(async user => {
                                        const dm = user?.dmChannel ?? await user.createDM();
                                        dm.send({components: [getPoliceRow(game.users)]});
                                    });
                                if (game.users.filter(item => item.role === Roles.KILLER && item.isKilled === false).length > 0)
                                    discordBot.users.fetch(game.users.filter(item => item.role === Roles.KILLER && item.isKilled === false)[0].userid).then(async user => {
                                        const dm = user?.dmChannel ?? await user.createDM();
                                        dm.send({components: [getKillerRow(game.users)]});
                                    });
                            }
                        }
                        curHandlingGames.set(game.id, game);
                        break;
                    }
                }
            } catch (err) {
                console.log("error")
            }
        } else {
            interaction.reply({ephemeral: true, content: "Неправильные данные"});
            return;
        }
    }else if (interaction.isButton()){
        const gameId = Number(interaction.customId.split('').splice(1, 5).join(''))
        switch (interaction.customId[0]){
            case 'j':{
                require('./commands/join').execute(interaction, gameId);
                break;
            }
            case 'c':{
                require('./commands/cancel').execute(interaction, gameId);
                break;
            }
            case 's':{
                require('./commands/start').execute(interaction, gameId);
                break;
            }
            case 'l':{
                require('./commands/leave').execute(interaction, gameId);
                break;
            }
            case 'e':{
                require('./commands/end').execute(interaction, gameId);
                break;
            }
        }


    }
});

discordBot.on('ready', () => {
    console.log("started");
});

discordBot.login(TOKEN);