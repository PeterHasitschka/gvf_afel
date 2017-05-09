import {NodepathAbstract} from "../../../../gvfcore/components/graphvis/graphs/nodepath/nodepathabstract";
import {NodeAbstract} from "../../../../gvfcore/components/graphvis/graphs/nodes/nodeelementabstract";
import {Plane} from "../../../../gvfcore/components/plane/plane";
export class LearningPath extends NodepathAbstract {

    protected static lineColor = 0x00AAAA;
    protected static lineWidth;
    protected static opacity = 0.8;

    constructor(nodesToConnect:NodeAbstract[], plane:Plane) {
        super(nodesToConnect, plane, {
            lineColor: LearningPath.lineColor,
            lineWidth: LearningPath.lineWidth,
            opacity: LearningPath.opacity
        });
    }
}