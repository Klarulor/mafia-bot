import BaseRole from "./BaseRole";
import {Action} from "../../types/Action";

export default class CustomRole extends BaseRole{
    constructor(name:string, action: Action, delayForActivity: number, groupDes: boolean, count: string, spawnFrom: number, placeHolder: string, imageLink: string, selfSelectable: boolean, description: string) {
        super();
        this._roleName = name;
        this.ActionOnSelect = action;
        this.DelayForActivity = delayForActivity;
        this.GroupDecision = groupDes;
        this.Count = count;
        switch (action){
            case "kill":{
                this.Emojis = ['🪓', '🪚', '🔪', '🔨', '🪛', '🦴', '☠', '🩸'];
                break;
            }
            case "heal":{
                this.Emojis = ['💉', '💊', '🩹', '🩺', '🚑', '🧫', '🧪', '♥'];
                break;
            }
            case "alibi":{
                this.Emojis = ['♥', '💖', '🍓', '💋', '👠'];
                break;
            }
            case "check":{
                this.Emojis = ['🔍', '🔎', '🚓', '👮', '🕵', '🚔', '🚨', '📔'];
                break;
            }
            case "full_check":{
                this.Emojis = ['🔍', '🔎', '🚓', '👮', '🕵', '🚔', '🚨', '📔'];
                break;
            }
            default:{
                this.Emojis = ['😛', '😝', '😜'];
                break;
            }
        }
        this.SpawnFrom = spawnFrom;
        this._placeHolder = placeHolder;
        this.ImageLink = imageLink;
        this.SelfSelectable = selfSelectable;
        this._description = description;
    }
}