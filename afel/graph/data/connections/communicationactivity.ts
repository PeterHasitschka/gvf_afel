import {Activity} from "./activity";
import {AfelLearnerDataEntity} from "../learner";
import {AfelResourceDataEntity} from "../resource";
export class CommunicationActivity extends Activity {

    protected static dataList:CommunicationActivity[] = [];

    constructor(id:number, learner1:AfelLearnerDataEntity, learner2:AfelLearnerDataEntity, data:Object) {

        super(id, learner1, learner2, data);

        this.type = Activity.TYPE_LEARNING;

        CommunicationActivity.dataList.push(this);
    }


    public static getDataList(){
        return CommunicationActivity.dataList;
    }
}