import {EdgeColored} from "../../../../gvfcore/components/graphvis/graphs/edges/edgeelementcolored";
import {Plane} from "../../../../gvfcore/components/plane/plane";
import {NodeLearner} from "../nodes/learner";
import {NodeResource} from "../nodes/resource";
import {ResourceResourceContentBasedSimilar} from "../../data/connections/resresCbSimilar";
export class EdgeResourceResourceCbSimilar extends EdgeColored {

    protected static color = 0x0000FF;
    protected static opacity = 0.99;

    constructor(r1:NodeResource, r2:NodeResource, plane:Plane, connectionEntity:ResourceResourceContentBasedSimilar) {
        super(r1, r2, plane, EdgeResourceResourceCbSimilar.color, connectionEntity);
    }
}