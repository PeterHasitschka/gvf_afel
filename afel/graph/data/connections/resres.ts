import {BasicConnection} from "../../../../gvfcore/components/graphvis/data/databasicconnection";
import {BasicEntity} from "../../../../gvfcore/components/graphvis/data/databasicentity";
import {AfelResourceDataEntity} from "../resource";
import {AfelTagDataEntity} from "../tag";

/**
 * ResourceResourceTransitionConnection Connection
 * @author Peter Hasitschka
 */
export abstract class ResourceResourceTransitionConnection extends BasicConnection {

    protected static dataList:ResourceResourceTransitionConnection[] = [];


    constructor(id = null, resourceSrc:AfelResourceDataEntity, resourceDst:AfelResourceDataEntity, data:Object) {
        if (!id)
            id = ResourceResourceTransitionConnection.dataList.length;
        super(id, resourceSrc, resourceDst, data);
        ResourceResourceTransitionConnection.dataList.push(this);
    }


    public getResourceSrc():AfelResourceDataEntity {
        return <AfelResourceDataEntity>this.entitySrc;
    }

    public getResourceDst():AfelResourceDataEntity {
        return <AfelResourceDataEntity>this.entityDst;
    }

    /**
     * Get all Connections
     * @returns {ResourceTagConnection[]}
     */
    public static getDataList():ResourceResourceTransitionConnection[] {
        return ResourceResourceTransitionConnection.dataList;
    }

}