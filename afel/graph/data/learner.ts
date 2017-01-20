
import {Resource} from "./resource";
import {Activity} from "./activity";
import {DataAbstract} from "../../../gvfcore/components/graphvis/data/abstract";

/**
 * Learner Data object
 * Holding data of a single Learner
 * @author Peter Hasitschka
 */
export class Learner extends DataAbstract {

    protected static dataList:Learner[] = [];

    /**
     * Learner constructor
     * @param data Holds an id and at least a 'name' property by current definition
     */
    constructor(protected data: Object) {
        super(data);
        Learner.dataList.push(this);
    }

    /**
     * Static method to get all learners that share a specific resource
     * @param resource {Resource}
     * @returns {Learner[]}
     */
    public static getLearnersByResource(resource:Resource):Learner[]{

        let outList:Learner[] = [];
        Activity.getDataList().forEach((activitiy:Activity) => {
            if (activitiy.getType() !== Activity.TYPE_LEARNING)
                return;
            if(activitiy.getData(Activity.RESOURCE_ID) === resource.getId())
                outList.push(<Learner>Learner.getObject(activitiy.getData(Activity.LEARNER_ID)));
        });

        return outList;
    }

    /**
     * Get all Learners
     * @returns {Learner[]}
     */
    public static getDataList():Learner[]{
        return Learner.dataList;
    }
}