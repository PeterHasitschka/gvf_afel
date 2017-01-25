
import {Plane} from "../../../gvfcore/components/plane/plane";
import {NodeLearner} from "../nodes/learner";
import {EdgeColored} from "../../../gvfcore/components/graphvis/graphs/edges/edgeelementcolored";
export class EdgeLearnersLearning extends EdgeColored {

    protected static color = 0x5555ff;

    constructor(learnerNode1:NodeLearner, learnerNode2:NodeLearner, plane:Plane) {
        super(learnerNode1, learnerNode2, plane, EdgeLearnersLearning.color);
    }
}