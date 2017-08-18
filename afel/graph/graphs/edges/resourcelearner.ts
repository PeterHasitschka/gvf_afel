import {EdgeColored} from "../../../../gvfcore/components/graphvis/graphs/edges/edgeelementcolored";
import {Plane} from "../../../../gvfcore/components/plane/plane";
import {NodeLearner} from "../nodes/learner";
import {NodeResource} from "../nodes/resource";
import {LearningActivity} from "../../data/connections/learningactivity";
export class EdgeResourceLearner extends EdgeColored {

    protected static color = 0x008888;
    protected static opacity = 0.3;

    constructor(r:NodeResource, l:NodeLearner, plane:Plane, connectionEntity:LearningActivity) {
        super(r, l, plane, EdgeResourceLearner.color, connectionEntity);
    }
}