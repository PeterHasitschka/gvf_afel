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


export class AfelAutoResourceGraph extends AutoGraph {

    protected mappingStructure = {
        nodes: [
            {
                data: AfelResourceDataEntity,
                node: NodeResource
            }
        ],
        edges: [
            {
                type: AUTOGRAPH_EDGETYPES.BY_FUNCTION,
                fct: this.getResourceNodesBybySameLearnersResource.bind(this),
                sourceNodeType: NodeResource,
                edge: EdgeResourceResource
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


    protected getResourceNodesBybySameLearnersResource(resNode:NodeResource) {
        let resNodes:NodeResource[] = [];
        resNode.getDataEntity().getConnections().forEach((cr:BasicConnection) => {
            if (cr.constructor !== LearningActivity)
                return;

            (<LearningActivity>cr).getLearner().getConnections().forEach((cl:BasicConnection) => {
                if (cl.constructor !== LearningActivity)
                    return;
                let connectedRes = (<LearningActivity>cl).getResource();

                if (connectedRes.getId() === resNode.getDataEntity().getId())
                    return;

                connectedRes.getRegisteredGraphElements().forEach((n:NodeResource) => {
                    if (n.getPlane().getId() !== this.plane.getId())
                        return;

                    if (cl.getAlreadyPaintedFlag(this.plane.getId()))
                        return;
                    cl.setAlreadyPaintedFlag(this.plane.getId());
                    resNodes.push(n);
                });
            })
        });
        return resNodes;
    }
}