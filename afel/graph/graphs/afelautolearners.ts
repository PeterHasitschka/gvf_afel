import {Plane} from "../../../gvfcore/components/plane/plane";
import {AutoGraph, AUTOGRAPH_EDGETYPES} from "../../../gvfcore/components/graphvis/graphs/autograph";
import {GraphLayoutFdlQuadtreeCompleteAfelGraph} from "../layouts/completegraphfdlquadtree";
import {AfelResourceDataEntity} from "../data/resource";
import {NodeResource} from "./nodes/resource";
import {AfelLearnerDataEntity} from "../data/learner";
import {NodeLearner} from "./nodes/learner";
import {LearningActivity} from "../data/connections/learningactivity";
import {EdgeResourceLearner} from "./edges/resourcelearner";
import {EdgeResourceResource} from "./edges/resourceresource";
import {BasicConnection} from "../../../gvfcore/components/graphvis/data/databasicconnection";
import {EdgeAbstract} from "../../../gvfcore/components/graphvis/graphs/edges/edgeelementabstract";
import {EdgeLearnerLearner} from "./edges/learnerlearner";


export class AfelAutoLearnersGraph extends AutoGraph {

    protected mappingStructure = {
        nodes: [
            {
                data: AfelLearnerDataEntity,
                node: NodeLearner
            }
        ],
        edges: [
            {
                type: AUTOGRAPH_EDGETYPES.BY_FUNCTION,
                fct: this.getLearnerNodesBybySameResourceLearner.bind(this),
                sourceNodeType: NodeLearner,
                edge: EdgeLearnerLearner
            }
        ]
    };

    constructor(protected plane:Plane) {
        super(plane);
        this.layoutClass = GraphLayoutFdlQuadtreeCompleteAfelGraph;
    }

    public init() {
        super.init();
    }


    protected getLearnerNodesBybySameResourceLearner(learnerNode:NodeLearner) {
        let learnerNodes:NodeLearner[] = [];
        learnerNode.getDataEntity().getConnections().forEach((firstConnection:BasicConnection) => {
            if (firstConnection.constructor !== LearningActivity)
                return;

            (<LearningActivity>firstConnection).getResource().getConnections().forEach((secondConnection:BasicConnection) => {
                if (secondConnection.constructor !== LearningActivity)
                    return;
                let connectedLearner = (<LearningActivity>secondConnection).getLearner();

                if (connectedLearner.getId() === learnerNode.getDataEntity().getId())
                    return;

                connectedLearner.getRegisteredGraphElements().forEach((n:NodeLearner) => {
                    if (n.getPlane().getId() !== this.plane.getId())
                        return;

                    if (secondConnection.getAlreadyPaintedFlag(this.plane.getId()))
                        return;
                    secondConnection.setAlreadyPaintedFlag(this.plane.getId());
                    learnerNodes.push(n);
                });
            })
        });
        return learnerNodes;
    }
}