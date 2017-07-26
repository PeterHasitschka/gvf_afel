import {AfelResourceDataEntity} from "./resource";
import {Activity} from "./connections/activity";
import {DataAbstract} from "../../../gvfcore/components/graphvis/data/dataabstract";
import {BasicEntity} from "../../../gvfcore/components/graphvis/data/databasicentity";
import {LearningActivity} from "./connections/learningactivity";
import {CommunicationActivity} from "./connections/communicationactivity";

/**
 * AfelTagDataEntity Data object
 * @author Peter Hasitschka
 */
export class AfelTagDataEntity extends BasicEntity {

    protected static dataList:AfelTagDataEntity[] = [];

    /**
     * AfelTagDataEntity constructor
     */
    constructor(id:Number = null, tag:string) {
        if (id === null)
            id = AfelTagDataEntity.dataList.length;
        super(id, {tag: tag});
        AfelTagDataEntity.dataList.push(this);
    }

    /**
     * Get all Tags
     * @returns {AfelLearnerDataEntity[]}
     */
    public static getDataList():AfelTagDataEntity[] {
        return AfelTagDataEntity.dataList;
    }
}