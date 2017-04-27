import {EdgeColored} from "../../../../gvfcore/components/graphvis/graphs/edges/edgeelementcolored";
import {Plane} from "../../../../gvfcore/components/plane/plane";
import {NodeLearner} from "../nodes/learner";
import {NodeResource} from "../nodes/resource";
export class EdgeResourceLearner extends EdgeColored {

    protected static color = 0xff0000;
    protected static opacity = 0.3;

    constructor(r:NodeResource, l:NodeLearner, plane:Plane) {
        super(r, l, plane, EdgeResourceLearner.color);
    }
}