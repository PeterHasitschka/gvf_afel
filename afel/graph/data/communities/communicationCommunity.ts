import {Community} from "./community";
import {Learner} from "../learner";
export class CommunicationCommunity extends Community {

    protected static dataList:CommunicationCommunity[] = [];
    //protected entities:Learner[] = [];

    constructor(id:number, learner:Learner[], data:Object) {
        super(id, learner, data);
        CommunicationCommunity.dataList.push(this);
    }

    public static getDataList():CommunicationCommunity[] {
        return CommunicationCommunity.dataList;
    }

    public getEntities():Learner[] {
        return <Learner[]>this.entities
    }
}