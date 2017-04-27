import {Activity} from "./activity";
import {Learner} from "../learner";
import {Resource} from "../resource";
export class LearningActivity extends Activity {

    protected static dataList:LearningActivity[] = [];

    constructor(id:number, protected learner:Learner, protected resource:Resource, data:Object) {

        super(id, learner, resource, data);

        this.type = Activity.TYPE_LEARNING;

        LearningActivity.dataList.push(this);
    }


    public static getDataList(){
        return LearningActivity.dataList;
    }

    public getLearner():Learner {
        return this.learner;
    }

    public getResource():Resource {
        return this.resource;
    }
}