import {Plane} from '../../plane/plane';
import {GraphAbstract} from './abstract';
import {Resource} from '../data/resource';
import {DataService} from '../../../services/data.service';

import {NodeLearner} from './nodes/learner';

import {GraphLayoutRandom} from './layouts/random';
import {InterGraphEventService, INTERGRAPH_EVENTS} from "../../../services/intergraphevents.service";
import {NodeResource} from "./nodes/resource";
import {Learner} from "../data/learner";
import {Activity} from "../data/activity";
import {NodeAbstract} from "./nodes/abstract";
import {EdgeColored} from "./edges/colored";
import log1p = require("core-js/fn/math/log1p");
import {EdgeAbstract} from "./edges/abstract";
import {GraphLayoutFdl} from "./layouts/fdl";

/**
 * The resource graph shows relations between Learning-Resources
 * Thus its Data consists of @see{Resource} data objects.
 * @author Peter Hasitschka
 */
export class LearnerGraph extends GraphAbstract {

    protected data:Resource[];

    constructor(plane:Plane) {
        super(plane);

        this.dataGetterMethod = DataService.getInstance().getLearners.bind(DataService.getInstance());

        this.nodetype = NodeLearner;
        this.layoutClass = GraphLayoutFdl;

        this.addEventListeners();
    }

    /**
     * Adding event listeners for hovered and un-hovered resource(!) nodes but also for same nodes
     */
    private addEventListeners() {
        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.LEARNER_NODE_HOVERED, function (e) {
            let node:NodeLearner = e.detail;
            node.highlightNode();
            this.plane.getGraphScene().render();
        }.bind(this));

        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.LEARNER_NODE_LEFT, function (e) {
            let node:NodeLearner = e.detail;
            node.deHighlightNode();
            this.plane.getGraphScene().render();
        }.bind(this));

        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.RESOURCE_NODE_HOVERED, function (e) {

            let node:NodeResource = e.detail;
            let affectedLearners:Learner[] = Learner.getLearnersByResource(<Resource>node.getDataEntity());
            affectedLearners.forEach((l:Learner) => {
                let affectedLearnerNodes = this.getNodeByDataEntity(l);

                affectedLearnerNodes.forEach((n:NodeLearner) => {
                    n.highlightNode();
                })
            });
            this.plane.getGraphScene().render();
        }.bind(this));


        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.RESOURCE_NODE_LEFT, function (e) {
            this.nodes.forEach((n:NodeLearner) => {
                n.deHighlightNode();
            });
            this.plane.getGraphScene().render();
        }.bind(this));
    }


    public init():void {
        super.init();
    }

    /**
     * Creating edges that connect learners with others that share resources and those who communicate
     * @returns {EdgeAbstract[]}
     */
    protected createEdges():EdgeAbstract[] {
        let activities = DataService.getInstance().getActivities();
        let edges:EdgeAbstract[] = [];

        let resources = {};
        let communications = {};
        activities.forEach((activity:Activity) => {
            if (activity.getType() === Activity.TYPE_LEARNING) {
                let rId = activity.getData(Activity.RESOURCE_ID);
                let lId = activity.getData(Activity.LEARNER_ID);
                if (typeof resources[rId] == 'undefined')
                    resources[rId] = [];
                resources[rId].push(lId);
            }
            else if (activity.getType() === Activity.TYPE_COMMUNICATING) {
                let l1Id = activity.getData(Activity.LEARNER1_ID);
                let l2Id = activity.getData(Activity.LEARNER2_ID);

                if (typeof communications[l1Id] === "undefined")
                    communications[l1Id] = [];
                communications[l1Id].push(l2Id);
            }
        });

        let existingResourceEdgeList = {};

        for (let rId in resources) {
            let learners = resources[rId];

            if (learners.length < 2)
                continue;

            for (let i in learners) {
                let lKey = parseInt(i);
                if (lKey >= learners.length - 1)
                    continue;

                let lId1 = learners[lKey];
                let lId2 = learners[lKey + 1];
                let n1:NodeAbstract = this.getNodeByDataId(lId1);
                let n2:NodeAbstract = this.getNodeByDataId(lId2);

                /**
                 * Prevent same connection again.
                 */
                let min = Math.min(n1.getDataEntity().getId(), n2.getDataEntity().getId());
                let max = Math.max(n1.getDataEntity().getId(), n2.getDataEntity().getId());
                if (typeof existingResourceEdgeList[min] === "undefined")
                    existingResourceEdgeList[min] = [];
                if (existingResourceEdgeList[min].indexOf(max) !== -1) {
                    //console.log("L", min, max);
                    continue;
                }
                existingResourceEdgeList[min].push(max);


                let learningConnection = new EdgeColored(n1, n2, this.plane, 0xaa00aa);
                n1.addEdge(learningConnection);
                n2.addEdge(learningConnection);
                edges.push(learningConnection);

            }
        }

        // Reset, since different type of connections may exist on same node pairs
        existingResourceEdgeList = {};

        for (let l1Id in communications) {
            let l1Communicators = communications[l1Id];

            for (let l2Key in l1Communicators) {
                let l2Id = l1Communicators[l2Key];

                let n1:NodeAbstract = this.getNodeByDataId(parseInt(l1Id));
                let n2:NodeAbstract = this.getNodeByDataId(l2Id);

                /**
                 * Prevent same connection again.
                 */
                let min = Math.min(n1.getDataEntity().getId(), n2.getDataEntity().getId());
                let max = Math.max(n1.getDataEntity().getId(), n2.getDataEntity().getId());
                if (typeof existingResourceEdgeList[min] === "undefined")
                    existingResourceEdgeList[min] = [];
                if (existingResourceEdgeList[min].indexOf(max) !== -1) {
                    //console.log("C", min, max);
                    continue;
                }
                existingResourceEdgeList[min].push(max);


                let communicationConnection = new EdgeColored(n1, n2, this.plane, 0xaaaa00);
                n1.addEdge(communicationConnection);
                n2.addEdge(communicationConnection);
                edges.push(communicationConnection);
            }
        }
        console.log("# of edges in learner graph:" + edges.length);

        return edges;
    }

}