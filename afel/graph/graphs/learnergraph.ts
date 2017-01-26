import log1p = require("core-js/fn/math/log1p");
import {GraphAbstract} from "../../../gvfcore/components/graphvis/graphs/graphabstract";
import {Plane} from "../../../gvfcore/components/plane/plane";
import {NodeLearner} from "./nodes/learner";
import {GraphLayoutFdl} from "../../../gvfcore/components/graphvis/graphs/layouts/graphlayoutfdl";
import {InterGraphEventService, INTERGRAPH_EVENTS} from "../../../gvfcore/services/intergraphevents.service";
import {NodeResource} from "./nodes/resource";
import {EdgeAbstract} from "../../../gvfcore/components/graphvis/graphs/edges/edgeelementabstract";
import {Learner} from "../data/learner";
import {Resource} from "../data/resource";
import {AfelData} from "../../afeldata";
import {LearningActivity} from "../data/learningactivity";
import {CommunicationActivity} from "../data/communicationactivity";
import {EdgeLearnersLearning} from "./edges/learnerlearning";
import {EdgeLearnersCommunicating} from "./edges/learnercommunicating";
import {GraphVisConfig} from "../../../gvfcore/components/graphvis/config";
import {LearningCommunity} from "../data/communities/learningCommunity";
import {CommunicationCommunity} from "../data/communities/communicationCommunity";

declare var jLouvain:any;
/**
 * The resource graph shows relations between Learning-Resources
 * Thus its Data consists of @see{Resource} data objects.
 * @author Peter Hasitschka
 */
export class LearnerGraph extends GraphAbstract {


    constructor(plane:Plane) {
        super(plane);

        this.dataGetterMethod = AfelData.getInstance().getLearners.bind(AfelData.getInstance());

        this.nodetype = NodeLearner;
        this.layoutClass = GraphLayoutFdl;

        this.addEventListeners();
    }

    /**
     * Adding event listeners for hovered and un-hovered resource(!) graphelements but also for same graphelements
     */
    protected addEventListeners() {

        super.addEventListeners();

        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.NODE_HOVERED, function (e) {
            let node:NodeResource = e.detail;
            if (node.name !== NodeResource.IDENTIFIER)
                return;

            let affectedLearners:Learner[] = Learner.getLearnersByResource(<Resource>node.getDataEntity());
            affectedLearners.forEach((l:Learner) => {
                let affectedLearnerNodes = this.getNodeByDataEntity(l);

                affectedLearnerNodes.forEach((n:NodeLearner) => {
                    n.highlight();
                })
            });
            this.plane.getGraphScene().render();
        }.bind(this));

        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.NODE_LEFT, function (e) {
            let node:NodeResource = e.detail;
            if (node.name !== NodeResource.IDENTIFIER)
                return;

            this.graphElements.forEach((n:NodeLearner) => {
                n.deHighlight();
            });
            this.plane.getGraphScene().render();
        }.bind(this));

    }


    public init():void {
        super.init();

        this.extractCommunities();
    }


    protected extractCommunities() {
        let louvainNodes = [];
        let louvainEdgesComm = [];
        let louvainEdgesLearn = [];
        this.graphElements.forEach((ln:NodeLearner) => {
            louvainNodes.push(ln.getDataEntity().getId());

            ln.getEdges().forEach((e:EdgeAbstract) => {

                if (e.constructor === EdgeLearnersCommunicating) {
                    louvainEdgesComm.push({
                        source: e.getSourceNode().getDataEntity().getId(),
                        target: e.getDestNode().getDataEntity().getId(),
                        weight: 1.0
                    });
                } else if (e.constructor === EdgeLearnersLearning) {
                    louvainEdgesLearn.push({
                        source: e.getSourceNode().getDataEntity().getId(),
                        target: e.getDestNode().getDataEntity().getId(),
                        weight: 1.0
                    });
                }
            });
        });

        let createCommunities = function(nodes, edges, communityClass){
            let c = jLouvain().nodes(nodes).edges(edges);
            let communityMapping = c();

            let communityEntities = {}
            for (var lId in communityMapping) {
                let cId =communityMapping[lId];

                if (typeof communityEntities[cId] === "undefined")
                    communityEntities[cId] = [];
                let lEntity = Learner.getObject(parseInt(lId));
                communityEntities[cId].push(lEntity);
            }

            let communities=[];
            for (let cKey in communityEntities) {
                if (communityEntities[cKey].length < 3)
                    continue;
                let community = new communityClass(communityClass.getDataList().length, communityEntities[cKey], {});
                communities.push(community);
            }
            return communities;
        };

        let lcs = createCommunities(louvainNodes, louvainEdgesLearn, LearningCommunity);
        let ccs = createCommunities(louvainNodes, louvainEdgesComm, CommunicationCommunity);
        AfelData.getInstance().setLearningCommunities(lcs);
        AfelData.getInstance().setCommunicationCommunities(ccs);

    }


    /**
     * Creating edges that connect learners with others that share resources and those who communicate
     * @returns {EdgeAbstract[]}
     */
    protected createEdges():EdgeAbstract[] {


        let edges:EdgeAbstract[] = this.calculateSameLearningEdges();
        edges = edges.concat(this.createCommunicationEdges());
        return edges;
    }

    /**
     * Connecting learners which communicate
     * @returns {EdgeAbstract[]}
     */
    private createCommunicationEdges() {
        let edges:EdgeAbstract[] = [];
        let existingLearnersCommunicationEdgeList = [];
        CommunicationActivity.getDataList().forEach((ca:CommunicationActivity) => {

            let communicators = ca.getEntities();
            let l1 = communicators.src;
            let l2 = communicators.dst;

            // Prevent creating existing edges
            let min = Math.min(l1.getId(), l2.getId());
            let max = Math.max(l1.getId(), l1.getId());
            if (typeof existingLearnersCommunicationEdgeList[min] === "undefined")
                existingLearnersCommunicationEdgeList[min] = [];
            if (existingLearnersCommunicationEdgeList[min].indexOf(max) !== -1)
                return;
            existingLearnersCommunicationEdgeList[min].push(max);

            // Create edge finally
            let n1 = <NodeLearner>this.getNodeByDataId(l1.getId());
            let n2 = <NodeLearner>this.getNodeByDataId(l2.getId());

            if (n1 === null || n2 === null) {
                console.warn("One of the graphelements for creating an edge is null!", n1, n2, l1, l2);
                return;
            }
            let communicationConnection = new EdgeLearnersCommunicating(n1, n2, this.plane);
            n1.addEdge(communicationConnection);
            n2.addEdge(communicationConnection);
            edges.push(communicationConnection);
        });
        console.log("Communication Edges: ", edges.length);
        return edges;
    }

    /**
     * Creates edges for each pair of learner who LEARN THE SAME RESOURCES up to a specific tolerance (0<=t<=1)
     * @returns {EdgeAbstract[]}
     */
    private calculateSameLearningEdges() {

        let edges:EdgeAbstract[] = [];
        let existingLearnersLearningEdgeList = [];
        let resourceIdsOfLearners = [];

        let tolerance = GraphVisConfig['afel'].samelearning_tolerance;

        // Store simple Ids of each learner's resources first for faster calculation
        Learner.getDataList().forEach((learner:Learner) => {
            let learnersResourceids = [];
            learner.getLearningActivities().forEach((la:LearningActivity)=> {
                learnersResourceids.push(la.getResource().getId());
            });
            resourceIdsOfLearners.push({l: learner, r: learnersResourceids});
        });

        // Go through those data and check if similar to other learners' resources
        resourceIdsOfLearners.forEach((learnersResources) => {
            let learner = learnersResources.l;
            let rs = learnersResources.r;

            if (!rs.length)
                return;

            // Iterate through all Resource Ids of every other learner and compare
            resourceIdsOfLearners.forEach((otherLearnersResources) => {
                let otherLearner = otherLearnersResources.l;
                let otherRs = otherLearnersResources.r;
                if (learner.getId() === otherLearner.getId())
                    return;

                // Check mutually if the learned resources match up to a tolerance
                let found1 = 0;
                rs.forEach((rId) => {
                    otherRs.indexOf(rId) > -1 ? found1++ : null;
                });
                let factorFound1 = found1 / rs.length;
                if (factorFound1 < tolerance)
                    return;

                // Do the same again vice versa
                let found2 = 0;
                otherRs.forEach((rId) => {
                    rs.indexOf(rId) > -1 ? found2++ : null;
                });
                let factorFound2 = found2 / otherRs.length;
                if (factorFound2 < tolerance)
                    return;


                // Prevent creating existing edges
                let min = Math.min(learner.getId(), otherLearner.getId());
                let max = Math.max(learner.getId(), otherLearner.getId());
                if (typeof existingLearnersLearningEdgeList[min] === "undefined")
                    existingLearnersLearningEdgeList[min] = [];
                if (existingLearnersLearningEdgeList[min].indexOf(max) !== -1)
                    return;
                existingLearnersLearningEdgeList[min].push(max);


                // Create edge finally
                let n1 = <NodeLearner>this.getNodeByDataId(learner.getId());
                let n2 = <NodeLearner>this.getNodeByDataId(otherLearner.getId());

                if (n1 === null || n2 === null) {
                    console.warn("One of the graphelements for creating an edge is null!", n1, n2, learner, otherLearner);
                    return;
                }

                let learningConnection = new EdgeLearnersLearning(n1, n2, this.plane);
                n1.addEdge(learningConnection);
                n2.addEdge(learningConnection);
                edges.push(learningConnection);
            });
        });


        console.log("Learning Edges: ", edges.length);
        return edges;
    }
}