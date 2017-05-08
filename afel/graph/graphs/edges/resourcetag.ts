import {EdgeColored} from "../../../../gvfcore/components/graphvis/graphs/edges/edgeelementcolored";
import {Plane} from "../../../../gvfcore/components/plane/plane";
import {NodeLearner} from "../nodes/learner";
import {NodeResource} from "../nodes/resource";
export class EdgeResourceTag extends EdgeColored {

    protected static color = 0x990000;
    protected static opacity = 0.3;

    constructor(r1:NodeResource, r2:NodeResource, plane:Plane) {
        super(r1, r2, plane, EdgeResourceTag.color);
    }
}