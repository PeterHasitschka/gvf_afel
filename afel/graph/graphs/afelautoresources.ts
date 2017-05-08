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
import {NodeAbstract} from "../../../gvfcore/components/graphvis/graphs/nodes/nodeelementabstract";
import {BasicEntity} from "../../../gvfcore/components/graphvis/data/databasicentity";
import {InterGraphEventService, INTERGRAPH_EVENTS} from "../../../gvfcore/services/intergraphevents.service";


export class AfelAutoResourceGraph extends AutoGraph {

    protected applyWeights = true;
    protected thinOut = false;


    protected mappingStructure = {
        nodes: [
            {
                data: AfelResourceDataEntity,
                node: NodeResource
            }
        ],
        edges: [
            {
                type: AUTOGRAPH_EDGETYPES.BY_ONE_HOP,
                sourceNodeType: NodeResource,
                hopDataEntityType: AfelLearnerDataEntity,
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


        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.NODE_HOVERED, function (e) {

            let nodeHovered = <NodeAbstract>e.detail;

            // Only handle events from other planes!
            if (nodeHovered.getPlane().getId() === this.plane.getId())
                return;

            switch (nodeHovered.constructor) {
                case NodeLearner :
                    this.graphElements.forEach((n:NodeResource) => {
                        let resource:AfelResourceDataEntity = <AfelResourceDataEntity>n.getDataEntity();
                        resource.getConnections().forEach((c:BasicConnection) => {

                            if (!(c instanceof LearningActivity))
                                return;

                            if ((<LearningActivity>c).getLearner().getId() === nodeHovered.getDataEntity().getId())
                                n.highlight();
                        });
                    });
                    this.plane.getGraphScene().render();
                    break;

                case NodeResource :
                    this.graphElements.forEach((n:NodeResource) => {
                        let resource:AfelResourceDataEntity = <AfelResourceDataEntity>n.getDataEntity();
                        if (resource.getId() === nodeHovered.getDataEntity().getId())
                            n.highlight();
                    });
                    this.plane.getGraphScene().render();
                    break;
            }
        }.bind(this));


        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.NODE_LEFT, function (e) {
            let nodeHovered = <NodeAbstract>e.detail;
            switch (nodeHovered.constructor) {
                default :
                    this.graphElements.forEach((n:NodeResource) => {
                        n.deHighlight(false);
                    });
                    this.plane.getGraphScene().render();
                    break;
            }
        }.bind(this));
    }


}