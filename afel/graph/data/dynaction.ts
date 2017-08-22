import {BasicEntity} from "../../../gvfcore/components/graphvis/data/databasicentity";
import forEach = require("core-js/fn/array/for-each");
import {AfelResourceDataEntity} from "./resource";
import {BasicConnection} from "../../../gvfcore/components/graphvis/data/databasicconnection";
import {DynActionResConnection} from "./connections/dynactionRes";

/**
 * AfelDynActionDataEntity Data object
 * Holding data of a single AfelDynActionDataEntity
 * @author Peter Hasitschka
 */
export class AfelDynActionDataEntity extends BasicEntity {

    protected static dataList:AfelDynActionDataEntity[] = [];
    protected learnerPath;

    /**
     * AfelDynActionDataEntity constructor
     * @param data
     */
    constructor(id:number = null, data:Object) {
        if (id === null)
            id = AfelDynActionDataEntity.dataList.length;
        super(id, data);
        AfelDynActionDataEntity.dataList.push(this);
    }


    /**
     * Get all Dynamic Actions
     * @returns {AfelDynActionDataEntity[]}
     */
    public static getDataList():AfelDynActionDataEntity[] {
        return AfelDynActionDataEntity.dataList;
    }

    public getConnectedResource():AfelResourceDataEntity {

        let BreakException = {};
        let res:AfelResourceDataEntity = null;
        try {
            this.getConnections().forEach((c:BasicConnection) => {
                if (c.constructor === DynActionResConnection) {
                    res = (<DynActionResConnection>c).getResource();
                    throw BreakException;
                }
            })
        } catch (e) {
            if (e !== BreakException)
                throw e;
        }

        return res;
    }
}