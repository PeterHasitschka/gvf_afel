import {EdgeColored} from "../../../../gvfcore/components/graphvis/graphs/edges/edgeelementcolored";
import {Plane} from "../../../../gvfcore/components/plane/plane";
import {NodeLearner} from "../nodes/learner";
import {NodeResource} from "../nodes/resource";
import {ResourceTagConnection} from "../../data/connections/resourcetag";
import {AfelMetanodeResources} from "../metanodes/resGroup";
import {NodeDynAction} from "../nodes/dynaction";
import {AfelMetanodeDynActions} from "../metanodes/dynActionGroup";
export class EdgeDynActionMetaGroup extends EdgeColored {

    protected static color = 0xAAAA00;
    protected static opacity = 0.7;

    constructor(dan:NodeDynAction, mg:AfelMetanodeDynActions, plane:Plane) {
        let options = {
            'spline': {
                spline: false,
                splineOnLineOffset: 0.9,
                splineNormalLengthFactor: 0.3,
                left: false
            }
        };

        super(dan, mg, plane, EdgeDynActionMetaGroup.color, null, options);
    }

    public getDynActionNode():NodeDynAction {
        return <NodeDynAction>this.sourceNode;
    }

    public getMetaNode():AfelMetanodeDynActions {
        return <AfelMetanodeDynActions>this.destNode;
    }
}