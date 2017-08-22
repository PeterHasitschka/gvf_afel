import {EdgeColored} from "../../../../gvfcore/components/graphvis/graphs/edges/edgeelementcolored";
import {Plane} from "../../../../gvfcore/components/plane/plane";
import {NodeLearner} from "../nodes/learner";
import {NodeResource} from "../nodes/resource";
import {NodeDynAction} from "../nodes/dynaction";
export class EdgeDynactionDynaction extends EdgeColored {

    protected static color = 0xFF0000;
    protected static opacity = 0.3;

    constructor(d1:NodeDynAction, d2:NodeDynAction, plane:Plane) {
        super(d1, d2, plane, EdgeDynactionDynaction.color);
    }
}