import {Plane} from "../../../gvfcore/components/plane/plane";
import {AutoGraph, AUTOGRAPH_EDGETYPES} from "../../../gvfcore/components/graphvis/graphs/autograph";
import {GraphLayoutFdlQuadtreeCompleteAfelGraph} from "../layouts/completegraphfdlquadtree";
import {AfelResourceDataEntity} from "../data/resource";
import {NodeResource} from "./nodes/resource";
import {AfelLearnerDataEntity} from "../data/learner";
import {NodeLearner} from "./nodes/learner";
import {LearningActivity} from "../data/connections/learningactivity";
import {BasicConnection} from "../../../gvfcore/components/graphvis/data/databasicconnection";
import {NodeAbstract} from "../../../gvfcore/components/graphvis/graphs/nodes/nodeelementabstract";
import {InterGraphEventService, INTERGRAPH_EVENTS} from "../../../gvfcore/services/intergraphevents.service";
import {ElementAbstract} from "../../../gvfcore/components/graphvis/graphs/graphelementabstract";
import {LearningPath} from "./nodepath/learningpath";
import {AfelTagDataEntity} from "../data/tag";
import {EdgeResourceResourceByLearner} from "./edges/resourceresourcebylearner";
import {EdgeResourceResourceByTag} from "./edges/resourceresourcebytag";
import {NodeTag} from "./nodes/tag";
import {ResourceTagConnection} from "../data/connections/resourcetag";
import {EdgeResourceResourceGeneral} from "./edges/resourceresourcegeneral";
import {ResourceResourceTransitionConnectionGeneral} from "../data/connections/resresTransGeneral";


export class AfelAutoResourceTransitionNetworkGraph extends AutoGraph {

    protected applyCalculatedWeights = false;
    protected applyOfflineWeightsByData = true;
    protected thinOut = false;
    protected activeLearningPath = null;

    protected mappingStructure = {
        nodes: [
            {
                data: AfelResourceDataEntity,
                node: NodeResource
            }
        ],
        edges: [
            {
                type: AUTOGRAPH_EDGETYPES.BY_DATA,
                dataConnection: ResourceResourceTransitionConnectionGeneral,
                edge: EdgeResourceResourceGeneral
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
                case NodeLearner :

                    let learner = <AfelLearnerDataEntity>(nodeHovered.getDataEntity());
                    this.showLearningPath(learner);

                    this.graphElements.forEach((n:NodeResource) => {
                        let resource:AfelResourceDataEntity = <AfelResourceDataEntity>n.getDataEntity();
                        resource.getConnections().forEach((c:BasicConnection) => {

                            if (!(c instanceof LearningActivity))
                                return;

                            if ((<LearningActivity>c).getLearner().getId() === nodeHovered.getDataEntity().getId()) {
                                n.highlight();
                            }
                        });
                    });
                    this.plane.getGraphScene().render();
                    break;
                case NodeTag :

                    this.graphElements.forEach((n:NodeResource) => {
                        let resource:AfelResourceDataEntity = <AfelResourceDataEntity>n.getDataEntity();
                        resource.getConnections().forEach((c:BasicConnection) => {

                            if (!(c instanceof ResourceTagConnection))
                                return;

                            if ((<ResourceTagConnection>c).getTag().getId() === nodeHovered.getDataEntity().getId()) {
                                n.highlight();
                            }
                        });
                    });
                    this.plane.getGraphScene().render();
                    break;

                case NodeResource :
                    this.graphElements.forEach((n:NodeResource) => {
                        let resource:AfelResourceDataEntity = <AfelResourceDataEntity>n.getDataEntity();
                        if (resource.getId() === nodeHovered.getDataEntity().getId()) {
                            n.highlight();
                        }

                    });
                    this.plane.getGraphScene().render();
                    break;
            }
        }.bind(this));


        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.NODE_LEFT, function (e) {
            this.deleteLearningPath();
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


    protected showLearningPath(learner:AfelLearnerDataEntity) {
        let nodes = [];
        let lp = learner.getLearnerPath();
        for (var k in lp) {
            let res = <AfelResourceDataEntity>lp[k].r;
            res.getRegisteredGraphElements().forEach((e:ElementAbstract) => {
                if (e.constructor !== NodeResource || e.getPlane().getId() !== this.plane.getId())
                    return;
                nodes.push(e);
            });
        }

        if (nodes.length < 2)
            return;

        if (this.activeLearningPath)
            this.deleteLearningPath();

        this.activeLearningPath = new LearningPath(nodes, this.plane);
        this.plane.getGraphScene().addObject(this.activeLearningPath);
        this.plane.getGraphScene().render();
    }

    protected deleteLearningPath() {
        if (!this.activeLearningPath)
            return;
        this.plane.getGraphScene().removeObject(this.activeLearningPath);
        this.activeLearningPath = null;

        this.plane.getGraphScene().render();
    }


}