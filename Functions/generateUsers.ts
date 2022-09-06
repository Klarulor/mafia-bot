import User from "../types/user";
import {discordBot} from "../bot";
import {Roles} from "../types/roles";

export default async function generateUsers(users: string[]): Promise<User[]> {
    const mafia: string[] = [];
    const mafiaCountFor = Math.floor(users.length / 3);
    for (let i = 0; i < mafiaCountFor; i++) {
        mafia.push(users[Math.floor(Math.random() * users.length)]);
        users.splice(users.indexOf(mafia[i]), 1);
    }
    let doctor = users[Math.floor(Math.random() * users.length)];
    users.splice(users.indexOf(doctor), 1);
    let police = users[Math.floor(Math.random() * users.length)];
    users.splice(users.indexOf(police), 1);
    let usersArr: User[] = [];
    for (let i = 0; i < users.length; i++) {
        const user = await discordBot.users.fetch(users[i]);
        usersArr.push({
            userTag: user.tag,
            userid: users[i],
            role: Roles.INNOCENT,
            isKilled: false
        })
    }
    for(let mafId of mafia){
        const mafiaUser = await discordBot.users.fetch(mafId)
        usersArr.push({
            userTag: mafiaUser.tag,
            userid: mafId,
            role: Roles.MAFIA,
            isKilled: false
        })
    }

    const doctorUser = await discordBot.users.fetch(doctor)
    usersArr.push({
        userTag: doctorUser.tag,
        userid: doctor,
        role: Roles.DOCTOR,
        isKilled: false
    });

    const policeUser = await discordBot.users.fetch(police)
    usersArr.push({
        userTag: policeUser.tag,
        userid: police,
        role: Roles.POLICE,
        isKilled: false
    });

    return usersArr;

}