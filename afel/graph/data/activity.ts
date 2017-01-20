import {DataAbstract} from "../../../gvfcore/components/graphvis/data/abstract";

/**
 * Activity Data object
 * Holding data of a single Activity that relates to at least a Learner
 * @author Peter Hasitschka
 */
export class Activity extends DataAbstract {

    protected static dataList:Activity[] = [];

    public static TYPE_LEARNING = "learning";
    public static TYPE_COMMUNICATING = "communicating";
    public static RESOURCE_ID = "resource_id";
    public static LEARNER_ID = "learner_id";
    public static LEARNER1_ID = "learner1_id";
    public static LEARNER2_ID = "learner2_id";

    /**
     * Activity constructor
     * @param data Holds an id and at least a 'type' property (see static strings).
     * If type is learning, a 'learner_id' and a 'resource_id' are necessary.
     * Else if type is communicating 'learner1_id' and 'learner2_id' are necessary.
     */
    constructor(protected data:Object) {
        super(data);
        Activity.dataList.push(this);
    }

    public getType():string {
        return this.data["type"];
    }

    /**
     * Get all Activities
     * @returns {Activity[]}
     */
    public static getDataList():Activity[] {
        return Activity.dataList;
    }

}