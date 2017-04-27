import {Community} from "./community";
import {AfelLearnerDataEntity} from "../learner";
export class LearningCommunity extends Community {

    protected static dataList:LearningCommunity[] = [];
    //protected entities:AfelLearnerDataEntity[] = [];

    constructor(id:number, learner:AfelLearnerDataEntity[], data:Object) {
        super(id, learner, data);
        LearningCommunity.dataList.push(this);
    }

    public static getDataList():LearningCommunity[] {
        return LearningCommunity.dataList;
    }

    public getEntities():AfelLearnerDataEntity[] {
        return <AfelLearnerDataEntity[]>this.entities
    }
}