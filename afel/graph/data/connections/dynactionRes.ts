import {BasicConnection} from "../../../../gvfcore/components/graphvis/data/databasicconnection";
import {BasicEntity} from "../../../../gvfcore/components/graphvis/data/databasicentity";
import {AfelResourceDataEntity} from "../resource";
import {AfelTagDataEntity} from "../tag";
import {AfelDynActionDataEntity} from "../dynaction";

/**
 * DynActionResConnection
 * @author Peter Hasitschka
 */
export class DynActionResConnection extends BasicConnection {

    protected static dataList:DynActionResConnection[] = [];


    constructor(id = null, action:AfelDynActionDataEntity, resource:AfelResourceDataEntity, data:Object) {
        if (!id)
            id = DynActionResConnection.dataList.length;
        super(id, action, resource, data);
        DynActionResConnection.dataList.push(this);
    }


    public getDynAction():AfelDynActionDataEntity {
        return <AfelDynActionDataEntity>this.entitySrc;
    }

    public getResource():AfelResourceDataEntity {
        return <AfelResourceDataEntity>this.entityDst;
    }
    /**
     * Get all Connections
     * @returns {DynActionResConnection[]}
     */
    public static getDataList():DynActionResConnection[] {
        return DynActionResConnection.dataList;
    }

}