import BaseRole from "./BaseRole";
import {localisations} from "../../index";

export default class MafiaRole extends BaseRole {
    constructor() {
        super()
        this.NameLocals = {
            EN: localisations.EN.role_mafia_name,
            RU: localisations.RU.role_mafia_name,
            UA: localisations.UA.role_mafia_name
        }
        this.RoleName = "mafia";
        this.DelayForActivity = 1;
        this.ActionOnSelect = "kill";
        this.GroupDecision = true;
        this.Count = "Math.floor({pCount}/3)";
        this.Emojis = ['🔪', '🪓', '🩸'];
        this.SpawnFrom = 0;
        this.PlaceHolder = localisations.EN.role_mafia_placeHolder;
        this.PlaceHolderLocals = {
            EN: localisations.EN.role_mafia_placeHolder,
            RU: localisations.RU.role_mafia_placeHolder,
            UA: localisations.UA.role_mafia_placeHolder
        };
        this.ImageLink = "https://media.discordapp.net/attachments/1015944207220879370/1015959932228616242/unknown.png?width=469&height=469";
        this.SelfSelectable = true;
        this.Description = localisations.EN.role_mafia_description;
        this.DescriptionLocals = {
            EN: localisations.EN.role_mafia_description,
            RU: localisations.RU.role_mafia_description,
            UA: localisations.UA.role_mafia_description
        };
    }
}