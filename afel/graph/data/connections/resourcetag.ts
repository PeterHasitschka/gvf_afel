import {BasicConnection} from "../../../../gvfcore/components/graphvis/data/databasicconnection";
import {BasicEntity} from "../../../../gvfcore/components/graphvis/data/databasicentity";
import {AfelResourceDataEntity} from "../resource";
import {AfelTagDataEntity} from "../tag";

/**
 * Resource Tag Connection
 * @author Peter Hasitschka
 */
export class ResourceTagConnection extends BasicConnection {

    protected static dataList:ResourceTagConnection[] = [];


    constructor(id = null, resource:AfelResourceDataEntity, tag:AfelTagDataEntity, data:Object) {
        if (!id)
            id = ResourceTagConnection.dataList.length;
        super(id, resource, tag, data);
        ResourceTagConnection.dataList.push(this);
    }


    public getResource():AfelResourceDataEntity {
        return <AfelResourceDataEntity>this.entitySrc;
    }

    public getTag():AfelTagDataEntity {
        return <AfelTagDataEntity>this.entityDst;
    }

    /**
     * Get all Connections
     * @returns {ResourceTagConnection[]}
     */
    public static getDataList():ResourceTagConnection[] {
        return ResourceTagConnection.dataList;
    }

}