import {CommunityElementAbstract} from "./communities/communityelementabstract";
import {GraphAbstract} from "../../../gvfcore/components/graphvis/graphs/graphabstract";
import {EdgeAbstract} from "../../../gvfcore/components/graphvis/graphs/edges/edgeelementabstract";

import {DataService} from "../../../gvfcore/services/data.service";
import {Plane} from "../../../gvfcore/components/plane/plane";
import {GraphLayoutFdl} from "../../../gvfcore/components/graphvis/graphs/layouts/graphlayoutfdl";
import {Community} from "../data/communities/community";
import {AfelData} from "../../afeldata";
import {CommunityGraphAbstract} from "./communitygraphabstract";
import {LearningCommunityElement} from "./communities/learningcommunityelement";


/**
 * Learning community graph
 * @author Peter Hasitschka
 */
export class LearningCommunityGraph extends CommunityGraphAbstract {

    protected edges:EdgeAbstract[];
    protected graphElements:LearningCommunityElement[];

    constructor(protected plane:Plane) {
        super(plane);

        this.dataGetterMethod = AfelData.getInstance().getLearningCommunities.bind(AfelData.getInstance());
        this.nodetype = LearningCommunityElement;
    }



    public init():void {
        super.init();

    }
}
