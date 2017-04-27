import {EdgeColored} from "../../../../gvfcore/components/graphvis/graphs/edges/edgeelementcolored";
import {Plane} from "../../../../gvfcore/components/plane/plane";
import {NodeLearner} from "../nodes/learner";
import {NodeResource} from "../nodes/resource";
export class EdgeLearnerLearner extends EdgeColored {

    protected static color = 0xcccccc;
    protected static opacity = 0.3;

    constructor(l1:NodeLearner, l2:NodeLearner, plane:Plane) {
        super(l1, l2, plane, EdgeLearnerLearner.color);
    }
}