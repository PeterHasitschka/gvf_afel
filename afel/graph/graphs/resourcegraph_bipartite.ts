import {GraphAbstract} from "../../../gvfcore/components/graphvis/graphs/graphabstract";
import {Resource} from "../data/resource";
import {EdgeAbstract} from "../../../gvfcore/components/graphvis/graphs/edges/edgeelementabstract";
import {Plane} from "../../../gvfcore/components/plane/plane";
import {AfelData} from "../../afeldata";
import {NodeResource} from "./nodes/resource";
import {GraphLayoutFdl} from "../../../gvfcore/components/graphvis/graphs/layouts/graphlayoutfdl";
import {InterGraphEventService, INTERGRAPH_EVENTS} from "../../../gvfcore/services/intergraphevents.service";
import {NodeLearner} from "./nodes/learner";
import {Learner} from "../data/learner";
import {UiService} from "../../../gvfcore/services/ui.service";
import {LearningActivity} from "../data/learningactivity";
import {GraphVisConfig} from "../../../gvfcore/components/graphvis/config";
import {EdgeResource} from "./edges/resource";
import {GvfCoreModule} from "../../../gvfcore/gvfcore.module";
import {GraphAutoCreateAbstract} from "../../../gvfcore/components/graphvis/graphs/graphautocreateabstract";
import {GraphBipartiteProjectionAbstract} from "../../../gvfcore/components/graphvis/graphs/graphbipartiteprojectionabstract";
import {Activity} from "../data/activity";

/**
 * The resource graph shows relations between Learning-Resources
 * Thus its Data consists of @see{Resource} data objects.
 * @author Peter Hasitschka
 */
export class ResourceGraphBPProj extends GraphBipartiteProjectionAbstract {

    protected data:Resource[];
    protected edges:EdgeAbstract[];
    protected weightLimit = 20;

    constructor(protected plane:Plane) {
        super(plane);


        this.nodetype = NodeResource;
        this.bipartiteEdgeType = EdgeResource;
        this.layoutClass = GraphLayoutFdl;

        this.plane.setBackgroundColor(GraphVisConfig["afel"].resourcegraph_background);
    }

    protected getPrimaryData():Resource[] {
        return AfelData.getInstance().getResources();
    }

    protected getSecondaryData():Learner[] {
        return AfelData.getInstance().getLearners();
    }

    protected getConnectionsData():LearningActivity[] {
        let ret = [];
        AfelData.getInstance().getActivities().forEach((a:Activity) => {
            if (a.constructor === LearningActivity)
                ret.push(a);
        });
        return <LearningActivity[]>ret;
    }

    /**
     * Adding event listeners for hovered and un-hovered learner(!) graphelements but also for same graphelements
     */
    protected addEventListeners() {

        super.addEventListeners();

        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.NODE_HOVERED, function (e) {
            let node:NodeLearner = e.detail;
            if (node.name !== NodeLearner.IDENTIFIER)
                return;

            let affectedResources:Resource[] = Resource.getResourcesByLearner(<Learner>node.getDataEntity());
            affectedResources.forEach((r:Resource) => {
                let affectedResourceNodes = this.getNodeByDataEntity(r);
                affectedResourceNodes.forEach((n:NodeResource) => {
                    n.highlight();

                    // Add to integraph connections
                    UiService.getInstance().addNodesToIntergraphConnection(node, n, "blue");
                });
            });
            this.plane.getGraphScene().render();
        }.bind(this));


        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.NODE_LEFT, function (e) {

            let node:NodeLearner = e.detail;
            if (node.name !== NodeLearner.IDENTIFIER)
                return;

            this.graphElements.forEach((n:NodeResource) => {
                n.deHighlight();
            });
            this.plane.getGraphScene().render();

            UiService.getInstance().clearIntergraphConnections();
        }.bind(this));
    }


    public init():void {
        super.init();
    }
}
