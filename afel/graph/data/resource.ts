import {AfelLearnerDataEntity} from "./learner";
import {Activity} from "./connections/activity";
import {DataAbstract} from "../../../gvfcore/components/graphvis/data/dataabstract";
import {BasicEntity} from "../../../gvfcore/components/graphvis/data/databasicentity";
import {LearningActivity} from "./connections/learningactivity";

/**
 * AfelResourceDataEntity Data object
 * Holding data of a single Learning-AfelResourceDataEntity
 * @author Peter Hasitschka
 */
export class AfelResourceDataEntity extends BasicEntity {

    protected static dataList:AfelResourceDataEntity[] = [];

    /**
     * AfelResourceDataEntity constructor
     * @param data Holds an ID, and at least a 'title' property by current definition
     */
    constructor(id:number = null, data:Object) {
        if (id === null)
            id = AfelResourceDataEntity.dataList.length;
        super(id, data);
        AfelResourceDataEntity.dataList.push(this);
    }


    /**
     * Static function to get all resources that have a specific learner
     * @param learner {AfelLearnerDataEntity}
     * @returns {AfelResourceDataEntity[]}
     */
    public static getResourcesByLearner(learner:AfelLearnerDataEntity):AfelResourceDataEntity[] {
        let outList:AfelResourceDataEntity[] = [];
        LearningActivity.getDataList().forEach((activity:LearningActivity) => {
            if (activity.getLearner().getId() === learner.getId())
                outList.push(activity.getResource());
        });
        return outList;
    }

    /**
     * Get all resources
     * @returns {AfelResourceDataEntity[]}
     */
    public static getDataList():AfelResourceDataEntity[] {
        return AfelResourceDataEntity.dataList;
    }
}
