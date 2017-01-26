import {GroupAbstract} from "../../../../gvfcore/components/graphvis/graphs/groups/groupelementabstract";
import {Community} from "../../data/communities/community";
import {Plane} from "../../../../gvfcore/components/plane/plane";
import {GraphVisConfig} from "../../../../gvfcore/components/graphvis/config";
/**
 * An abstract of afel communities
 * @author Peter Hasitschka
 */
export abstract class CommunityElementAbstract extends GroupAbstract {

    public static dataType = Community;

    constructor(x:number, y:number, protected dataEntity:Community, plane:Plane) {
        super(x, y, dataEntity, plane);
    }
}


