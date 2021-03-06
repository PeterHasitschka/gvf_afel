import {BasicConnection} from "../../../../gvfcore/components/graphvis/data/databasicconnection";
import {BasicEntity} from "../../../../gvfcore/components/graphvis/data/databasicentity";
import {AfelResourceDataEntity} from "../resource";
import {AfelTagDataEntity} from "../tag";
import {ResourceResourceTransitionConnection} from "./resres";

/**
 * ResourceResourceTransitionConnectionGeneral
 * Differs from ResourceResourceTransitionConnectionOfUserVisited, that this type of connection describes a transition
 * between two nodes, which was performed by ANY user, not specifically by the current one.
 * @author Peter Hasitschka
 */
export class ResourceResourceTransitionConnectionGeneral extends ResourceResourceTransitionConnection {

    protected static dataList:ResourceResourceTransitionConnectionGeneral[] = [];


    constructor(id = null, resourceSrc:AfelResourceDataEntity, resourceDst:AfelResourceDataEntity, data:Object) {
        if (!id)
            id = ResourceResourceTransitionConnection.dataList.length;
        super(id, resourceSrc, resourceDst, data);
        ResourceResourceTransitionConnectionGeneral.dataList.push(this);
    }


    /**
     * Get all Connections
     * @returns {ResourceResourceTransitionConnectionGeneral[]}
     */
    public static getDataList():ResourceResourceTransitionConnectionGeneral[] {
        return ResourceResourceTransitionConnectionGeneral.dataList;
    }

}