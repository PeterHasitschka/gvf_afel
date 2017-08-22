import {EdgeColored} from "../../../../gvfcore/components/graphvis/graphs/edges/edgeelementcolored";
import {Plane} from "../../../../gvfcore/components/plane/plane";
import {NodeLearner} from "../nodes/learner";
import {NodeResource} from "../nodes/resource";
import {NodeDynAction} from "../nodes/dynaction";
export class EdgeDynactionRes extends EdgeColored {

    protected static color = 0x5e5d1c;
    protected static opacity = 0.3;

    constructor(d:NodeDynAction, r:NodeResource, plane:Plane) {
        super(d, r, plane, EdgeDynactionRes.color);
    }
}