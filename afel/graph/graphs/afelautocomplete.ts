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
import {InterGraphEventService, INTERGRAPH_EVENTS} from "../../../gvfcore/services/intergraphevents.service";
import {NodeAbstract} from "../../../gvfcore/components/graphvis/graphs/nodes/nodeelementabstract";
import {BasicConnection} from "../../../gvfcore/components/graphvis/data/databasicconnection";
import {BasicEntity} from "../../../gvfcore/components/graphvis/data/databasicentity";
import {DataAbstract} from "../../../gvfcore/components/graphvis/data/dataabstract";
import {UiService} from "../../../gvfcore/services/ui.service";

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


        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.NODE_HOVERED, function (e) {

            let nodeHovered = <NodeAbstract>e.detail;

            // Only handle events from other planes!
            if (nodeHovered.getPlane().getId() === this.plane.getId())
                return;


            switch (nodeHovered.constructor) {
                default :
                    this.graphElements.forEach((n:NodeAbstract) => {
                        let dataEntity:DataAbstract = n.getDataEntity();

                        if (dataEntity.constructor !== nodeHovered.getDataEntity().constructor)
                            return;

                        if (dataEntity.getId() === nodeHovered.getDataEntity().getId()) {
                            n.highlight();
                            UiService.getInstance().addNodesToIntergraphConnection(nodeHovered, n, "blue");
                        }
                    });
                    this.plane.getGraphScene().render();
                    break;
            }
        }.bind(this));


        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.NODE_LEFT, function (e) {
            let nodeHovered = <NodeAbstract>e.detail;
            switch (nodeHovered.constructor) {
                default :
                    this.graphElements.forEach((n:NodeAbstract) => {
                        n.deHighlight(false);
                        UiService.getInstance().clearIntergraphConnections();
                    });
                    this.plane.getGraphScene().render();
                    break;
            }
        }.bind(this));

        this.applyWeightsFromDataEntities();
    }
}