import {EdgeColored} from "../../../gvfcore/components/graphvis/graphs/edges/colored";
import {NodeAbstract} from "../../../gvfcore/components/graphvis/graphs/nodes/abstract";
import {Plane} from "../../../gvfcore/components/plane/plane";
export class EdgeLearnersCommunicating extends EdgeColored {

    protected static color = 0xffaaaa;
    constructor(learner1:NodeAbstract, learner2:NodeAbstract, plane:Plane) {
        super(learner1, learner2, plane, EdgeLearnersCommunicating.color);
    }
}