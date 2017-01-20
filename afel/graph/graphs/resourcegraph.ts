

import {GraphAbstract} from "../../../gvfcore/components/graphvis/graphs/abstract";
import {Resource} from "../data/resource";
import {EdgeAbstract} from "../../../gvfcore/components/graphvis/graphs/edges/abstract";
import {Plane} from "../../../gvfcore/components/plane/plane";
import {AfelData} from "../../afeldata";
import {NodeResource} from "../nodes/resource";
import {GraphLayoutFdl} from "../../../gvfcore/components/graphvis/graphs/layouts/fdl";
import {InterGraphEventService, INTERGRAPH_EVENTS} from "../../../gvfcore/services/intergraphevents.service";
import {NodeLearner} from "../nodes/learner";
import {Learner} from "../data/learner";
import {UiService} from "../../../gvfcore/services/ui.service";
import {Activity} from "../data/activity";
import {NodeAbstract} from "../../../gvfcore/components/graphvis/graphs/nodes/abstract";
import {EdgeBasic} from "../../../gvfcore/components/graphvis/graphs/edges/basic";

/**
 * The resource graph shows relations between Learning-Resources
 * Thus its Data consists of @see{Resource} data objects.
 * @author Peter Hasitschka
 */
export class ResourceGraph extends GraphAbstract {

    protected data:Resource[];
    protected edges:EdgeAbstract[];

    constructor(protected plane:Plane) {
        super(plane);

        this.dataGetterMethod = AfelData.getInstance().getResources.bind(AfelData.getInstance());

        this.nodetype = NodeResource;
        this.layoutClass = GraphLayoutFdl;

        this.addEventListeners();
    }

    /**
     * Adding event listeners for hovered and un-hovered learner(!) nodes but also for same nodes
     */
    private addEventListeners() {
        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.RESOURCE_NODE_HOVERED, function (e) {
            let node:NodeResource = e.detail;
            node.highlightNode();
            this.plane.getGraphScene().render();
        }.bind(this));

        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.RESOURCE_NODE_LEFT, function (e) {
            let node:NodeResource = e.detail;
            node.deHighlightNode();
            this.plane.getGraphScene().render();
        }.bind(this));

        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.LEARNER_NODE_HOVERED, function (e) {

            let node:NodeLearner = e.detail;
            let affectedResources:Resource[] = Resource.getResourcesByLearner(<Learner>node.getDataEntity());
            affectedResources.forEach((r:Resource) => {
                let affectedResourceNodes = this.getNodeByDataEntity(r);
                affectedResourceNodes.forEach((n:NodeResource) => {
                    n.highlightNode();

                    // Add to integraph connections
                    UiService.getInstance().addNodesToIntergraphConnection(node, n);
                });
            });
            this.plane.getGraphScene().render();
        }.bind(this));


        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.LEARNER_NODE_LEFT, function (e) {

            this.nodes.forEach((n:NodeResource) => {
                n.deHighlightNode();
            });
            this.plane.getGraphScene().render();

            UiService.getInstance().clearIntergraphConnections();
        }.bind(this));
    }


    public init():void {
        super.init();
    }

    /**
     * Create edges that connect resources that share learners
     * @returns {EdgeAbstract[]}
     */
    protected createEdges():EdgeAbstract[] {
        let activities = AfelData.getInstance().getActivities();
        let edges:EdgeAbstract[] = [];

        let learnings = {};
        activities.forEach((activity:Activity) => {
            if (activity.getType() !== Activity.TYPE_LEARNING)
                return;
            let rId = activity.getData(Activity.RESOURCE_ID);
            let lId = activity.getData(Activity.LEARNER_ID);
            if (typeof learnings[lId] == 'undefined')
                learnings[lId] = [];
            learnings[lId].push(rId);
        });

        let existingEdgeList = {};

        for (let lKey in learnings) {
            if (learnings[lKey].length < 2)
                continue;

            learnings[lKey].forEach((rKey:number, i) => {

                if (i < learnings[lKey].length - 1) {
                    let n1:NodeAbstract = this.getNodeByDataId(rKey);
                    let n2:NodeAbstract = this.getNodeByDataId(learnings[lKey][i + 1]);

                    /**
                     * Prevent same connection again.
                     */
                    let min = Math.min(n1.getDataEntity().getId(), n2.getDataEntity().getId());
                    let max = Math.max(n1.getDataEntity().getId(), n2.getDataEntity().getId());
                    if (typeof existingEdgeList[min] === "undefined")
                        existingEdgeList[min] = [];
                    if (existingEdgeList[min].indexOf(max) !== -1) {
                        return;
                    }
                    existingEdgeList[min].push(max);


                    let resourceConnection = new EdgeBasic(n1, n2, this.plane);
                    n1.addEdge(resourceConnection);
                    n2.addEdge(resourceConnection);
                    edges.push(resourceConnection);
                }
            });
        }
        console.log("# of edges in resource graph:" + edges.length);
        return edges;
    }
}
