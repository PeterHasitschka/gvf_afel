
import {Learner} from "./learner";
import {Activity} from "./activity";
import {DataAbstract} from "../../../gvfcore/components/graphvis/data/abstract";

/**
 * Resource Data object
 * Holding data of a single Learning-Resource
 * @author Peter Hasitschka
 */
export class Resource extends DataAbstract {

    protected static dataList:Resource[] = [];

    /**
     * Resource constructor
     * @param data Holds an ID, and at least a 'title' property by current definition
     */
    constructor(protected data:Object) {
        super(data);
        Resource.dataList.push(this);
    }


    /**
     * Static function to get all resources that have a specific learner
     * @param learner {Learner}
     * @returns {Resource[]}
     */
    public static getResourcesByLearner(learner:Learner):Resource[] {

        let outList:Resource[] = [];
        Activity.getDataList().forEach((activitiy:Activity) => {
            if (activitiy.getType() !== Activity.TYPE_LEARNING)
                return;
            if (activitiy.getData(Activity.LEARNER_ID) === learner.getId())
                outList.push(<Resource>Resource.getObject(activitiy.getData(Activity.RESOURCE_ID)));
        });

        return outList;
    }

    /**
     * Get all resources
     * @returns {Resource[]}
     */
    public static getDataList():Resource[] {
        return Resource.dataList;
    }
}
