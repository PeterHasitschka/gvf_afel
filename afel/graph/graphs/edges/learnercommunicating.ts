import {EdgeColored} from "../../../../gvfcore/components/graphvis/graphs/edges/edgeelementcolored";
import {Plane} from "../../../../gvfcore/components/plane/plane";
import {NodeAbstract} from "../../../../gvfcore/components/graphvis/graphs/nodes/nodeelementabstract";
export class EdgeLearnersCommunicating extends EdgeColored {

    protected static color = 0x33cc33;
    constructor(learner1:NodeAbstract, learner2:NodeAbstract, plane:Plane) {
        super(learner1, learner2, plane, EdgeLearnersCommunicating.color);
    }
}