import {Plane} from "../../../gvfcore/components/plane/plane";
import {AutoGraph, AUTOGRAPH_EDGETYPES} from "../../../gvfcore/components/graphvis/graphs/autograph";
import {GraphLayoutFdlQuadtreeCompleteAfelGraph} from "../layouts/completegraphfdlquadtree";
import {AfelResourceDataEntity} from "../data/resource";
import {NodeResource} from "./nodes/resource";
import {AfelLearnerDataEntity} from "../data/learner";
import {NodeLearner} from "./nodes/learner";
import {LearningActivity} from "../data/connections/learningactivity";
import {BasicConnection} from "../../../gvfcore/components/graphvis/data/databasicconnection";
import {InterGraphEventService, INTERGRAPH_EVENTS} from "../../../gvfcore/services/intergraphevents.service";
import {NodeAbstract} from "../../../gvfcore/components/graphvis/graphs/nodes/nodeelementabstract";
import {AfelTagDataEntity} from "../data/tag";
import {NodeTag} from "./nodes/tag";
import {EdgeTagTag} from "./edges/tagtag";


export class AfelAutoTagsGraph extends AutoGraph {

    protected applyWeights = true;
    protected thinOut = false;

    protected mappingStructure = {
        nodes: [
            {
                data: AfelTagDataEntity,
                node: NodeTag
            }
        ],
        edges: [
            {
                type: AUTOGRAPH_EDGETYPES.BY_ONE_HOP,
                sourceNodeType: NodeTag,
                hopDataEntityType: AfelResourceDataEntity,
                edge: EdgeTagTag
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

}