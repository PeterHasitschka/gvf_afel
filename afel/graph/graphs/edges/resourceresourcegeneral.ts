import {EdgeColored} from "../../../../gvfcore/components/graphvis/graphs/edges/edgeelementcolored";
import {Plane} from "../../../../gvfcore/components/plane/plane";
import {NodeLearner} from "../nodes/learner";
import {NodeResource} from "../nodes/resource";
import {ResourceResourceTransitionConnectionGeneral} from "../../data/connections/resresGeneral";
export class EdgeResourceResourceGeneral extends EdgeColored {

    protected static color = 0x999999;
    protected static opacity = 0.3;

    constructor(r1:NodeResource, r2:NodeResource, plane:Plane, connectionEntity:ResourceResourceTransitionConnectionGeneral) {
        super(r1, r2, plane, EdgeResourceResourceGeneral.color, connectionEntity);
    }
}