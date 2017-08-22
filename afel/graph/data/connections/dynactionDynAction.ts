import {BasicConnection} from "../../../../gvfcore/components/graphvis/data/databasicconnection";
import {BasicEntity} from "../../../../gvfcore/components/graphvis/data/databasicentity";
import {AfelResourceDataEntity} from "../resource";
import {AfelTagDataEntity} from "../tag";
import {AfelDynActionDataEntity} from "../dynaction";

/**
 * DynActionDynActionConnection
 * @author Peter Hasitschka
 */
export class DynActionDynActionConnection extends BasicConnection {

    protected static dataList:DynActionDynActionConnection[] = [];


    constructor(id = null, action1:AfelDynActionDataEntity, action2:AfelDynActionDataEntity, data:Object) {
        if (!id)
            id = DynActionDynActionConnection.dataList.length;
        super(id, action1, action1, data);
        DynActionDynActionConnection.dataList.push(this);
    }


    public getDynAction1():AfelDynActionDataEntity {
        return <AfelDynActionDataEntity>this.entitySrc;
    }

    public getDynAction2():AfelDynActionDataEntity {
        return <AfelDynActionDataEntity>this.entitySrc;
    }

    /**
     * Get all Connections
     * @returns {DynActionResConnection[]}
     */
    public static getDataList():DynActionDynActionConnection[] {
        return DynActionDynActionConnection.dataList;
    }

}