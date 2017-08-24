import {EdgeColored} from "../../../../gvfcore/components/graphvis/graphs/edges/edgeelementcolored";
import {Plane} from "../../../../gvfcore/components/plane/plane";
import {NodeLearner} from "../nodes/learner";
import {NodeResource} from "../nodes/resource";
import {ResourceTagConnection} from "../../data/connections/resourcetag";
import {AfelMetanodeResources} from "../metanodes/resGroup";
export class EdgeResourceMetaGroup extends EdgeColored {

    protected static color = 0x0000FF;
    protected static opacity = 0.3;

    constructor(r1:NodeResource, mg:AfelMetanodeResources, plane:Plane) {
        let options = {
            'spline': {
                spline: true,
                splineOnLineOffset: 0.9,
                splineNormalLengthFactor: 0.3,
                left: false
            }
        };

        super(r1, mg, plane, EdgeResourceMetaGroup.color, null, options);
    }

    public getResourceNode():NodeResource {
        return <NodeResource>this.sourceNode;
    }

    public getMetaNode():AfelMetanodeResources {
        return <AfelMetanodeResources>this.destNode;
    }
}