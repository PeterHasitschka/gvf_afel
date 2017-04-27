import {Resource} from "./resource";
import {Activity} from "./connections/activity";
import {DataAbstract} from "../../../gvfcore/components/graphvis/data/dataabstract";
import {BasicEntity} from "../../../gvfcore/components/graphvis/data/databasicentity";
import {LearningActivity} from "./connections/learningactivity";
import {CommunicationActivity} from "./connections/communicationactivity";

/**
 * Learner Data object
 * Holding data of a single Learner
 * @author Peter Hasitschka
 */
export class Learner extends BasicEntity {

    protected static dataList:Learner[] = [];

    private learningActivities:LearningActivity[] = [];
    private communicationActivities:CommunicationActivity[] = [];

    /**
     * Learner constructor
     * @param data Holds an id and at least a 'name' property by current definition
     */
    constructor(id:number, protected data:Object) {
        super(id, data);
        Learner.dataList.push(this);
    }

    /**
     * Static method to get all learners that share a specific resource
     * @param resource {Resource}
     * @returns {Learner[]}
     */
    public static getLearnersByResource(resource:Resource):Learner[] {

        let outList:Learner[] = [];
        LearningActivity.getDataList().forEach((activity:LearningActivity) => {
            if (activity.getResource().getId() === resource.getId())
                outList.push(activity.getLearner());
        });

        return outList;
    }

    public getCommunicationActivities(){
        return this.communicationActivities;
    }

    public addCommunicationActivity(activity:CommunicationActivity){
        this.communicationActivities.push(activity);
    }

    public getLearningActivities(){
        return this.learningActivities;
    }

    public addLearningActivity(activity:LearningActivity){
        this.learningActivities.push(activity);
    }


    /**
     * Get all Learners
     * @returns {Learner[]}
     */
    public static getDataList():Learner[] {
        return Learner.dataList;
    }
}