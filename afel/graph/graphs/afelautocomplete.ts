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
import {ResourceResourceTransitionConnection} from "../data/connections/resres";
import {ResourceResourceTransitionConnectionOfUserVisited} from "../data/connections/resresUserGenerated";
import {ResourceResourceTransitionConnectionGeneral} from "../data/connections/resresGeneral";
import {EdgeResourceResourceGeneral} from "./edges/resourceresourcegeneral";
import {EdgeResourceResourceOfUserVisited} from "./edges/resourceresourceuservisit";
import {ElementAbstract} from "../../../gvfcore/components/graphvis/graphs/graphelementabstract";
import {LearningPath} from "./nodepath/learningpath";
import {GraphLayoutAfelPseudoTimeline} from "../layouts/afelpseudotimeline";
import {GraphLayoutAfelTimelineSequence} from "../layouts/afeltimelinesequ";
import {AfelDynActionDataEntity} from "../data/dynaction";
import {NodeDynAction} from "./nodes/dynaction";
import {DynActionResConnection} from "../data/connections/dynactionRes";
import {EdgeDynactionRes} from "./edges/dynactionres";
import {DynActionDynActionConnection} from "../data/connections/dynactionDynAction";
import {EdgeDynactionDynaction} from "./edges/dynactiondynaction";

export class AfelAutoCompleteGraph extends AutoGraph {

    protected applyCalculatedWeights = false;
    protected applyOfflineWeightsByData = true;
    protected thinOut = false;

    protected mappingStructure = {
        nodes: [
            {
                data: AfelResourceDataEntity,
                node: NodeResource,
                filter: this.filterResourceOnlyFromInitCall
            },
            {
                data: AfelLearnerDataEntity,
                node: NodeLearner
            },
            {
                data: AfelTagDataEntity,
                node: NodeTag
            },
            {
                data: AfelDynActionDataEntity,
                node: NodeDynAction
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
            },
            {
                type: AUTOGRAPH_EDGETYPES.BY_DATA,
                dataConnection: ResourceResourceTransitionConnectionOfUserVisited,
                edge: EdgeResourceResourceOfUserVisited
            },
            {
                type: AUTOGRAPH_EDGETYPES.BY_DATA,
                dataConnection: ResourceResourceTransitionConnectionGeneral,
                edge: EdgeResourceResourceGeneral
            },
            // {
            //     type: AUTOGRAPH_EDGETYPES.BY_DATA,
            //     dataConnection: DynActionResConnection,
            //     edge: EdgeDynactionRes
            // },
            {
                type: AUTOGRAPH_EDGETYPES.BY_DATA,
                dataConnection: DynActionDynActionConnection,
                edge: EdgeDynactionDynaction
            }
        ],
        paths: [
            // {
            //     dataConnectionClass: ResourceResourceTransitionConnectionOfUserVisited,
            //     dataConnectionEntities: ResourceResourceTransitionConnectionOfUserVisited.getDataList,
            //     path: LearningPath
            // }
        ]
    };

    // Filter to only show init network, independent if other calls (e.g. global resource nw) was already performed
    protected filterResourceOnlyFromInitCall(data:BasicEntity) {
        if (data.getData("is_init_data"))
            return true;
        return false;
    }

    constructor(protected plane:Plane) {
        super(plane);
        // this.layoutClass = GraphLayoutFdlQuadtreeCompleteAfelGraph;
        // this.layoutClass = GraphLayoutAfelPseudoTimeline;
        this.layoutClass = GraphLayoutAfelTimelineSequence;
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