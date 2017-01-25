import {Learner} from "./learner";
import {Activity} from "./activity";
import {DataAbstract} from "../../../gvfcore/components/graphvis/data/dataabstract";
import {BasicEntity} from "../../../gvfcore/components/graphvis/data/databasicentity";
import {LearningActivity} from "./learningactivity";

/**
 * Resource Data object
 * Holding data of a single Learning-Resource
 * @author Peter Hasitschka
 */
export class Resource extends BasicEntity {

    protected static dataList:Resource[] = [];

    private learningActivities:LearningActivity[] = [];
    /**
     * Resource constructor
     * @param data Holds an ID, and at least a 'title' property by current definition
     */
    constructor(id:number, protected data:Object) {
        super(id, data);
        Resource.dataList.push(this);
    }


    /**
     * Static function to get all resources that have a specific learner
     * @param learner {Learner}
     * @returns {Resource[]}
     */
    public static getResourcesByLearner(learner:Learner):Resource[] {

        let outList:Resource[] = [];
        LearningActivity.getDataList().forEach((activity:LearningActivity) => {

            if (activity.getLearner().getId() === learner.getId())
                outList.push(activity.getResource());
        });

        return outList;
    }



    public getLearningActivities(){
        return this.learningActivities;
    }

    public addLearningActivity(activity:LearningActivity){
        this.learningActivities.push(activity);
    }



    /**
     * Get all resources
     * @returns {Resource[]}
     */
    public static getDataList():Resource[] {
        return Resource.dataList;
    }
}
