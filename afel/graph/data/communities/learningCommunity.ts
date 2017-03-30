import {Community} from "./community";
import {Learner} from "../learner";
export class LearningCommunity extends Community {

    protected static dataList:LearningCommunity[] = [];
    //protected entities:Learner[] = [];

    constructor(id:number, learner:Learner[], data:Object) {
        super(id, learner, data);
        LearningCommunity.dataList.push(this);
    }

    public static getDataList():LearningCommunity[] {
        return LearningCommunity.dataList;
    }

    public getEntities():Learner[] {
        return <Learner[]>this.entities
    }
}