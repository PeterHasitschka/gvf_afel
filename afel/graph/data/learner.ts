import {AfelResourceDataEntity} from "./resource";
import {Activity} from "./connections/activity";
import {DataAbstract} from "../../../gvfcore/components/graphvis/data/dataabstract";
import {BasicEntity} from "../../../gvfcore/components/graphvis/data/databasicentity";
import {LearningActivity} from "./connections/learningactivity";
import {CommunicationActivity} from "./connections/communicationactivity";

/**
 * AfelLearnerDataEntity Data object
 * Holding data of a single AfelLearnerDataEntity
 * @author Peter Hasitschka
 */
export class AfelLearnerDataEntity extends BasicEntity {

    protected static dataList:AfelLearnerDataEntity[] = [];

    /**
     * AfelLearnerDataEntity constructor
     * @param data Holds an id and at least a 'name' property by current definition
     */
    constructor(data:Object) {
        let id = AfelLearnerDataEntity.dataList.length;
        super(id, data);
        AfelLearnerDataEntity.dataList.push(this);
    }

    /**
     * Static method to get all learners that share a specific resource
     * @param resource {AfelResourceDataEntity}
     * @returns {AfelLearnerDataEntity[]}
     */
    public static getLearnersByResource(resource:AfelResourceDataEntity):AfelLearnerDataEntity[] {

        let outList:AfelLearnerDataEntity[] = [];
        LearningActivity.getDataList().forEach((activity:LearningActivity) => {
            if (activity.getResource().getId() === resource.getId())
                outList.push(activity.getLearner());
        });

        return outList;
    }

    /**
     * Get all Learners
     * @returns {AfelLearnerDataEntity[]}
     */
    public static getDataList():AfelLearnerDataEntity[] {
        return AfelLearnerDataEntity.dataList;
    }
}