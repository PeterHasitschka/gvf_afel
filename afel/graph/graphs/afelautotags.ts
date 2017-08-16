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
import {ResourceTagConnection} from "../data/connections/resourcetag";


export class AfelAutoTagsGraph extends AutoGraph {

    protected applyCalculatedWeights = true;
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
        ], paths : []
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

                    this.graphElements.forEach((n:NodeTag) => {
                        let tag:AfelTagDataEntity = <AfelTagDataEntity >n.getDataEntity();
                        tag.getConnections().forEach((c:BasicConnection) => {

                            if (!(c instanceof ResourceTagConnection))
                                return;

                            if ((<ResourceTagConnection>c).getResource().getId() === nodeHovered.getDataEntity().getId()) {
                                n.highlight();
                            }
                        });
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