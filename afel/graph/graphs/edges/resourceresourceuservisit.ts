import {EdgeColored} from "../../../../gvfcore/components/graphvis/graphs/edges/edgeelementcolored";
import {Plane} from "../../../../gvfcore/components/plane/plane";
import {NodeLearner} from "../nodes/learner";
import {NodeResource} from "../nodes/resource";
import {ResourceResourceTransitionConnectionOfUserVisited} from "../../data/connections/resresUserGenerated";
export class EdgeResourceResourceOfUserVisited extends EdgeColored {

    protected static color = 0xFF0000;
    protected static opacity = 0.5;

    constructor(r1:NodeResource, r2:NodeResource, plane:Plane, connectionEntity:ResourceResourceTransitionConnectionOfUserVisited) {
        super(r1, r2, plane, EdgeResourceResourceOfUserVisited.color, connectionEntity);
    }
}