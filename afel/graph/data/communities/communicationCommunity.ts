import {Community} from "./community";
import {AfelLearnerDataEntity} from "../learner";
export class CommunicationCommunity extends Community {

    protected static dataList:CommunicationCommunity[] = [];
    //protected entities:AfelLearnerDataEntity[] = [];

    constructor(id:number, learner:AfelLearnerDataEntity[], data:Object) {
        super(id, learner, data);
        CommunicationCommunity.dataList.push(this);
    }

    public static getDataList():CommunicationCommunity[] {
        return CommunicationCommunity.dataList;
    }

    public getEntities():AfelLearnerDataEntity[] {
        return <AfelLearnerDataEntity[]>this.entities
    }
}