import {CommunityGraphAbstract} from "./communitygraphabstract";
import {EdgeAbstract} from "../../../gvfcore/components/graphvis/graphs/edges/edgeelementabstract";
import {LearningCommunityElement} from "./communities/learningcommunityelement";
import {Plane} from "../../../gvfcore/components/plane/plane";
/**
 * Learning community graph
 * @author Peter Hasitschka
 */
export class LearningCommunityGraph extends CommunityGraphAbstract {

    protected edges:EdgeAbstract[];
    protected graphElements:LearningCommunityElement[];

    constructor(protected plane:Plane) {
        super(plane);

        //this.dataGetterMethod = AfelData.getInstance().getLearningCommunities.bind(AfelData.getInstance());
        this.nodetype = LearningCommunityElement;
    }



    public init():void {
        super.init();

    }
}
