import {Activity} from "./activity";
import {AfelLearnerDataEntity} from "../learner";
import {AfelResourceDataEntity} from "../resource";
export class LearningActivity extends Activity {

    protected static dataList:LearningActivity[] = [];
    protected learner:AfelLearnerDataEntity;
    protected resource:AfelResourceDataEntity;

    constructor(id:number = null, learner:AfelLearnerDataEntity, resource:AfelResourceDataEntity, data:Object) {
        if (id === null)
            id = LearningActivity.dataList.length;
        super(id, learner, resource, data);
        this.learner = learner;
        this.resource = resource
        this.type = Activity.TYPE_LEARNING;

        LearningActivity.dataList.push(this);
    }


    public static getDataList() {
        return LearningActivity.dataList;
    }

    public getLearner():AfelLearnerDataEntity {
        return this.learner;
    }

    public getResource():AfelResourceDataEntity {
        return this.resource;
    }
}