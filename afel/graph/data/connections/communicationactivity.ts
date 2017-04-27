import {Activity} from "./activity";
import {Learner} from "../learner";
import {Resource} from "../resource";
export class CommunicationActivity extends Activity {

    protected static dataList:CommunicationActivity[] = [];

    constructor(id:number, learner1:Learner, learner2:Learner, data:Object) {

        super(id, learner1, learner2, data);

        this.type = Activity.TYPE_LEARNING;

        CommunicationActivity.dataList.push(this);
    }


    public static getDataList(){
        return CommunicationActivity.dataList;
    }
}