import {AfelResourceDataEntity} from "./resource";
import {Activity} from "./connections/activity";
import {DataAbstract} from "../../../gvfcore/components/graphvis/data/dataabstract";
import {BasicEntity} from "../../../gvfcore/components/graphvis/data/databasicentity";
import {LearningActivity} from "./connections/learningactivity";
import {CommunicationActivity} from "./connections/communicationactivity";
import forEach = require("core-js/fn/array/for-each");
import {BasicConnection} from "../../../gvfcore/components/graphvis/data/databasicconnection";

/**
 * AfelLearnerDataEntity Data object
 * Holding data of a single AfelLearnerDataEntity
 * @author Peter Hasitschka
 */
export class AfelLearnerDataEntity extends BasicEntity {

    protected static dataList:AfelLearnerDataEntity[] = [];

    protected learnerPath;

    /**
     * AfelLearnerDataEntity constructor
     * @param data Holds an id and at least a 'name' property by current definition
     */
    constructor(id:number = null, data:Object) {
        if (id === null)
            id = AfelLearnerDataEntity.dataList.length;
        super(id, data);
        AfelLearnerDataEntity.dataList.push(this);
    }

    public getLearnerPath() {
        if (!this.learnerPath)
            this.calculateLearnerPath();
        return this.learnerPath;
    }


    protected calculateLearnerPath() {
        let map = [];
        this.getConnections().forEach((c:BasicConnection) => {
            if (c.constructor !== LearningActivity)
                return;
            let dateStr = c.getData("time");
            if (!dateStr)
                return;
            map.push({t: new Date(dateStr).getTime(), r: (<LearningActivity>c).getResource()});
        });

        map.sort(function (a, b) {
            return (a.t < b.t ? -1 : 1);
        });
        this.learnerPath = map;
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