import {CommunityElementAbstract} from "./communities/communityelementabstract";
import {Plane} from "../../../gvfcore/components/plane/plane";
import {GraphLayoutFdl} from "../../../gvfcore/components/graphvis/graphs/layouts/graphlayoutfdl";
import {GroupGraphAbstract} from "../../../gvfcore/components/graphvis/graphs/graphgroupabstract";


/**
 * Basic graph
 * Thus its Data consists of @see{Resource} data objects.
 * @author Peter Hasitschka
 */
export abstract class CommunityGraphAbstract extends GroupGraphAbstract {

    protected graphElements:CommunityElementAbstract[];

    constructor(protected plane:Plane) {
        super(plane);

        this.dataGetterMethod = null;
        this.nodetype = CommunityElementAbstract;

        //this.layoutClass = GraphLayoutRandom;
        this.layoutClass = GraphLayoutFdl;
    }




}
