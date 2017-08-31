import {EdgeColored} from "../../../../gvfcore/components/graphvis/graphs/edges/edgeelementcolored";
import {Plane} from "../../../../gvfcore/components/plane/plane";
import {NodeLearner} from "../nodes/learner";
import {NodeResource} from "../nodes/resource";
import {ResourceTagConnection} from "../../data/connections/resourcetag";
import {NodeTag} from "../nodes/tag";
export class EdgeResourceTag extends EdgeColored {

    protected static color = 0x990000;
    protected static opacity = 0.3;

    constructor(r:NodeResource, t:NodeTag, plane:Plane, connectionEntity:ResourceTagConnection) {
        super(r, t, plane, EdgeResourceTag.color, connectionEntity);
    }

    public getTagNode():NodeTag{
        return <NodeTag>this.getDestNode();
    }

    public getResNode():NodeResource{
        return <NodeResource>this.getSourceNode();
    }
}