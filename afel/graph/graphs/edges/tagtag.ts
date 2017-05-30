import {EdgeColored} from "../../../../gvfcore/components/graphvis/graphs/edges/edgeelementcolored";
import {Plane} from "../../../../gvfcore/components/plane/plane";
import {NodeTag} from "../nodes/tag";
export class EdgeTagTag extends EdgeColored {

    protected static color = 0x555555;
    protected static opacity = 0.3;

    constructor(t1:NodeTag, t2:NodeTag, plane:Plane) {
        super(t1, t2, plane, EdgeTagTag.color);
    }
}