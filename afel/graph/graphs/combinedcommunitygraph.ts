


import {GroupCombinedGraphAbstract} from "../../../gvfcore/components/graphvis/graphs/graphgroupcombinedabstract";
import {Plane} from "../../../gvfcore/components/plane/plane";
import {CommunityElementAbstract} from "./communities/communityelementabstract";
/**
 * Learning community graph
 * @author Peter Hasitschka
 */
export class CombinedCommunityGraph extends GroupCombinedGraphAbstract {

    protected static planeTitle = '<i class="fa fa-compress" aria-hidden="true"></i> <strong>Intersections</strong> ' +
        'between Communities';

    constructor(protected plane:Plane) {
        super(plane);

        this.nodetype = CommunityElementAbstract;
    }


    public init():void {
        super.init();

    }
}
