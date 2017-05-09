import {NodepathAbstract} from "../../../../gvfcore/components/graphvis/graphs/nodepath/nodepathabstract";
import {NodeAbstract} from "../../../../gvfcore/components/graphvis/graphs/nodes/nodeelementabstract";
import {Plane} from "../../../../gvfcore/components/plane/plane";
export class LearningPath extends NodepathAbstract {

    protected static lineColor1 = 0x00FF00;
    protected static lineColor2 = 0x0000FF;
    protected static lineWidth;
    protected static opacity = 0.8;

    constructor(nodesToConnect:NodeAbstract[], plane:Plane) {
        super(nodesToConnect, plane, {
            lineColor1: LearningPath.lineColor1,
            lineColor2: LearningPath.lineColor2,
            lineWidth: LearningPath.lineWidth,
            opacity: LearningPath.opacity
        });
    }
}