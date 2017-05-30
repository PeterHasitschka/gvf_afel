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
import {InterGraphEventService, INTERGRAPH_EVENTS} from "../../../gvfcore/services/intergraphevents.service";
import {NodeAbstract} from "../../../gvfcore/components/graphvis/graphs/nodes/nodeelementabstract";
import {UiService} from "../../../gvfcore/services/ui.service";


export class AfelAutoLearnersGraph extends AutoGraph {

    protected applyWeights = true;
    protected thinOut = true;
    protected thinOutThreshold = 0.0;

    protected mappingStructure = {
        nodes: [
            {
                data: AfelLearnerDataEntity,
                node: NodeLearner
            }
        ],
        edges: [
            {
                type: AUTOGRAPH_EDGETYPES.BY_ONE_HOP,
                sourceNodeType: NodeLearner,
                hopDataEntityType: AfelResourceDataEntity,
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

        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.NODE_HOVERED, function (e) {

                let nodeHovered = <NodeAbstract>e.detail;

                // Only handle events from other planes!
                if (nodeHovered.getPlane().getId() === this.plane.getId())
                    return;

                switch (nodeHovered.constructor) {
                    case NodeResource :
                        this.graphElements.forEach((n:NodeLearner) => {
                            let learner:AfelLearnerDataEntity = <AfelLearnerDataEntity>n.getDataEntity();
                            learner.getConnections().forEach((c:BasicConnection) => {

                                if (!(c instanceof LearningActivity))
                                    return;

                                if ((<LearningActivity>c).getResource().getId() === nodeHovered.getDataEntity().getId()) {
                                    n.highlight();
                                }
                            });
                        });
                        this.plane.getGraphScene().render();
                        break;

                    case NodeLearner :
                        this.graphElements.forEach((n:NodeLearner) => {
                            let learner:AfelLearnerDataEntity = <AfelLearnerDataEntity>n.getDataEntity();
                            if (learner.getId() === nodeHovered.getDataEntity().getId()) {
                                n.highlight();
                            }
                        });
                        this.plane.getGraphScene().render();
                        break;
                }
            }
                .bind(this)
        )
        ;


        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.NODE_LEFT, function (e) {
            let nodeHovered = <NodeAbstract>e.detail;
            switch (nodeHovered.constructor) {
                default :
                    this.graphElements.forEach((n:NodeLearner) => {
                        n.deHighlight(false);
                    });
                    this.plane.getGraphScene().render();
                    break;
            }
        }.bind(this));
    }

}