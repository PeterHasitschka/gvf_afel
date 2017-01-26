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
                    UiService.getInstance().addNodesToIntergraphConnection(node, n);
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

    /**
     * Create edges that connect resources that share learners
     * @returns {EdgeAbstract[]}
     */
    protected createEdges():EdgeAbstract[] {

        let edges = this.createLearningEdges();
        console.log("# of edges in resource graph:" + edges.length);
        return edges;
    }

    /**
     * Creates edges for each pair of resources who SHARE SAME LEARNERS up to a specific tolerance (0<=t<=1)
     * @returns {EdgeAbstract[]}
     */
    private createLearningEdges() {


        let edges:EdgeAbstract[] = [];

        let existingResResEdgeList = [];
        let learnerIdsOfResources = [];

        let tolerance = GraphVisConfig['afel'].samelearning_tolerance;

        // Store simple Ids of each res's learners first for faster calculation
        Resource.getDataList().forEach((res:Resource) => {
            let resLearnerIds = [];
            res.getLearningActivities().forEach((la:LearningActivity)=> {
                resLearnerIds.push(la.getLearner().getId());
            });
            learnerIdsOfResources.push({r: res, ls: resLearnerIds});
        });

        // Go through those data and check if similar to other res'
        learnerIdsOfResources.forEach((data) => {
            let res = data.r;
            let ls = data.ls;

            if (!ls.length)
                return;

            // Iterate through all learner Ids of every other res and compare
            learnerIdsOfResources.forEach((otherResLearner) => {
                let otherRes = otherResLearner.r;
                let otherLs = otherResLearner.ls;
                if (res.getId() === otherRes.getId())
                    return;

                // Check mutually if the the learners match up to a tolerance
                let found1 = 0;
                ls.forEach((rId) => {
                    otherLs.indexOf(rId) > -1 ? found1++ : null;
                });
                let factorFound1 = found1 / ls.length;
                if (factorFound1 < tolerance)
                    return;

                // Do the same again vice versa
                let found2 = 0;
                otherLs.forEach((rId) => {
                    ls.indexOf(rId) > -1 ? found2++ : null;
                });
                let factorFound2 = found2 / otherLs.length;
                if (factorFound2 < tolerance)
                    return;


                // Prevent creating existing edges
                let min = Math.min(res.getId(), otherRes.getId());
                let max = Math.max(res.getId(), otherRes.getId());
                if (typeof existingResResEdgeList[min] === "undefined")
                    existingResResEdgeList[min] = [];
                if (existingResResEdgeList[min].indexOf(max) !== -1)
                    return;
                existingResResEdgeList[min].push(max);


                // Create edge finally
                let n1 = <NodeResource>this.getNodeByDataId(res.getId());
                let n2 = <NodeResource>this.getNodeByDataId(otherRes.getId());

                if (n1 === null || n2 === null) {
                    console.warn("One of the graphelements for creating an edge is null!", n1, n2, res, otherRes);
                    return;
                }

                let learningConnection = new EdgeResource(n1, n2, this.plane);
                n1.addEdge(learningConnection);
                n2.addEdge(learningConnection);
                edges.push(learningConnection);
            });
        });

        console.log("Resource Edges: ", edges.length);
        return edges;
    }
}
