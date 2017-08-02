import {BasicConnection} from "../../../../gvfcore/components/graphvis/data/databasicconnection";
import {BasicEntity} from "../../../../gvfcore/components/graphvis/data/databasicentity";
import {AfelResourceDataEntity} from "../resource";
import {AfelTagDataEntity} from "../tag";
import {ResourceResourceTransitionConnection} from "./resres";

/**
 * ResourceResourceTransitionConnectionOfUserVisited
 * @author Peter Hasitschka
 */
export class ResourceResourceTransitionConnectionOfUserVisited extends ResourceResourceTransitionConnection{

    protected static dataList:ResourceResourceTransitionConnectionOfUserVisited[] = [];


    constructor(id = null, resourceSrc:AfelResourceDataEntity, resourceDst:AfelResourceDataEntity, data:Object) {
        if (!id)
            id = ResourceResourceTransitionConnection.dataList.length;
        super(id, resourceSrc, resourceDst, data);
        ResourceResourceTransitionConnectionOfUserVisited.dataList.push(this);
    }


    /**
     * Get all Connections
     * @returns {ResourceResourceTransitionConnectionOfUserVisited[]}
     */
    public static getDataList():ResourceResourceTransitionConnectionOfUserVisited[] {
        return ResourceResourceTransitionConnectionOfUserVisited.dataList;
    }

}