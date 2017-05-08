import {Plane} from "../../../gvfcore/components/plane/plane";
import {AutoGraph, AUTOGRAPH_EDGETYPES} from "../../../gvfcore/components/graphvis/graphs/autograph";
import {GraphLayoutFdlQuadtreeCompleteAfelGraph} from "../layouts/completegraphfdlquadtree";
import {AfelResourceDataEntity} from "../data/resource";
import {NodeResource} from "./nodes/resource";
import {AfelLearnerDataEntity} from "../data/learner";
import {NodeLearner} from "./nodes/learner";
import {LearningActivity} from "../data/connections/learningactivity";
import {EdgeResourceLearner} from "./edges/resourcelearner";
import {AfelTagDataEntity} from "../data/tag";
import {NodeTag} from "./nodes/tag";
import {ResourceTagConnection} from "../data/connections/resourcetag";
import {EdgeResourceTag} from "./edges/resourcetag";


export class AfelAutoCompleteGraph extends AutoGraph {

    protected applyWeights = true;
    protected thinOut = false;

    protected mappingStructure = {
        nodes: [
            {
                data: AfelResourceDataEntity,
                node: NodeResource
            },
            {
                data: AfelLearnerDataEntity,
                node: NodeLearner
            },
            {
                data: AfelTagDataEntity,
                node: NodeTag
            }
        ],
        edges: [
            {
                type: AUTOGRAPH_EDGETYPES.BY_DATA,
                dataConnection: LearningActivity,
                edge: EdgeResourceLearner
            },
            {
                type: AUTOGRAPH_EDGETYPES.BY_DATA,
                dataConnection: ResourceTagConnection,
                edge: EdgeResourceTag
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