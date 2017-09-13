import {BasicConnection} from "../../../../gvfcore/components/graphvis/data/databasicconnection";
import {BasicEntity} from "../../../../gvfcore/components/graphvis/data/databasicentity";
import {AfelResourceDataEntity} from "../resource";
import {AfelTagDataEntity} from "../tag";
import {ResourceResourceTransitionConnection} from "./resres";

/**
 * @author Peter Hasitschka
 */
export class ResourceResourceContentBasedSimilar extends ResourceResourceTransitionConnection {

    protected static dataList:ResourceResourceContentBasedSimilar[] = [];


    constructor(id = null, resourceSrc:AfelResourceDataEntity, resourceDst:AfelResourceDataEntity, data:Object) {
        if (!id)
            id = ResourceResourceTransitionConnection.dataList.length;
        super(id, resourceSrc, resourceDst, data);
        ResourceResourceContentBasedSimilar.dataList.push(this);
    }


    /**
     * Get all Connections
     * @returns {ResourceResourceContentBasedSimilar[]}
     */
    public static getDataList():ResourceResourceContentBasedSimilar[] {
        return ResourceResourceContentBasedSimilar.dataList;
    }

}