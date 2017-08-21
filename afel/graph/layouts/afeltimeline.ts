import {GraphLayoutAbstract} from "../../../gvfcore/components/graphvis/graphs/layouts/graphlayoutabstract";
import {Plane} from "../../../gvfcore/components/plane/plane";
import {NodeAbstract} from "../../../gvfcore/components/graphvis/graphs/nodes/nodeelementabstract";
import {EdgeAbstract} from "../../../gvfcore/components/graphvis/graphs/edges/edgeelementabstract";
import {AfelResourceDataEntity} from "../data/resource";
import {NodeResource} from "../graphs/nodes/resource";
import {EdgeResourceResourceOfUserVisited} from "../graphs/edges/resourceresourceuservisit";
import sort = require("core-js/fn/array/sort");
import {EdgeResourceResourceGeneral} from "../graphs/edges/resourceresourcegeneral";
import {NodeTag} from "../graphs/nodes/tag";
import {AfelTagDataEntity} from "../data/tag";
import {EdgeResourceTag} from "../graphs/edges/resourcetag";
import {LearningPath} from "../graphs/nodepath/learningpath";
import {ResourceResourceTransitionConnectionOfUserVisited} from "../data/connections/resresUserGenerated";
export class GraphLayoutAfelTimeline extends GraphLayoutAbstract {

    private connectedEntityIdsOrderOnTimeline = null;

    constructor(protected plane:Plane, nodes:NodeAbstract[], edges:EdgeAbstract[]) {
        super(plane, nodes, edges);
    }

    public setInitPositions(onFinish):void {
        onFinish();
    }


    public calculateLayout(onFinish, newNodes = null):void {
        // this.plane.setShowGreyOverlay(true);
        window.setTimeout(function () {
            this.calculate(false, null, newNodes);
            if (!newNodes)
                this.plane.getGraphScene().fitAllNodesInView(function () {
                    // this.plane.setShowGreyOverlay(false);
                    onFinish();
                }.bind(this));
            else
                this.plane.getGraphScene().render();
        }.bind(this), 0);

        return;
    }


    private calculate(animation:boolean = false, cb = null, newNodes = null) {

        let tmpResourcesOnTimeline:NodeResource[] = [];
        let tmpResourcesOthers:NodeResource[] = [];
        let tmpTagNodes:NodeTag[] = [];

        this.nodes.forEach((n:NodeAbstract) => {

            if (!n.getIsVisible() || !n.getDataEntity().getData("is_init_data"))
                return;
            switch (n.getDataEntity().constructor) {
                case AfelResourceDataEntity :

                    // Check if was visited by user or just related (= other) Resource node.
                    let edgesOfNode = n.getEdges();
                    let visitFound = false;

                    let BreakException = {};
                    try {
                        edgesOfNode.forEach((e:EdgeAbstract) => {
                            if (e.constructor === EdgeResourceResourceOfUserVisited) {
                                visitFound = true;
                            }
                        });
                    } catch (e) {
                        if (e !== BreakException)
                            throw e;
                    }
                    if (visitFound)
                        tmpResourcesOnTimeline.push(<NodeResource>n);
                    else
                        tmpResourcesOthers.push(<NodeResource>n);
                    break;

                case AfelTagDataEntity:
                    tmpTagNodes.push(<NodeTag>n);
                    break;

                default :
                    console.warn("Timeline-Layout: Data entity '" + n.getDataEntity().constructor.name + "' not found");
            }
        });


        // Find 'learning-path' by discovering the nodes on the ResourceResourceTransitionConnectionOfUserVisited connections
        // This is necessary since they are NOT connected by their order but by the incoming connection order from the server
        // In setResourceTimelinePositions the nodes are ordered by this list (@see sortResNodesByOrderedEntityIdList)
        let connectedResEntitiesByVisitOrder = [];
        ResourceResourceTransitionConnectionOfUserVisited.getDataList().forEach((rtrC:ResourceResourceTransitionConnectionOfUserVisited) => {

            let eSrc = rtrC.getResourceSrc();
            let eDst = rtrC.getResourceDst();

            if (connectedResEntitiesByVisitOrder.indexOf(eSrc.getId()) < 0)
                connectedResEntitiesByVisitOrder.push(eSrc.getId());
            if (connectedResEntitiesByVisitOrder.indexOf(eDst.getId()) < 0)
                connectedResEntitiesByVisitOrder.push(eDst.getId());
        });
        this.connectedEntityIdsOrderOnTimeline = connectedResEntitiesByVisitOrder;

        this.setResourceTimelinePositions(tmpResourcesOnTimeline);
        this.setResourceOthersPositions(tmpResourcesOthers);
        this.setTagPositions(tmpTagNodes);
    }

    /**
     * Simple sorting function that sorts the nodes by a list of entity-ids.
     * Necessary to get the correct order regarding the connections to show the timeline correctly.
     * The nodes do not come in the right order, thus they were ordered in this.calculate by their visit-connections
     * @param a
     * @param b
     * @returns {number}
     */
    private sortResNodesByOrderedEntityIdList(a:NodeResource, b:NodeResource) {
        return (this.connectedEntityIdsOrderOnTimeline.indexOf(a.getDataEntity().getId()) <
        this.connectedEntityIdsOrderOnTimeline.indexOf(b.getDataEntity().getId()) ? -1 : 1);
    }


    /**
     * Resources might be visited multiple times.
     * We set a data value which holds the first visit date.
     * This is then relevant for the timeline position
     * @param nodes
     */
    private setNodesMinDateOnTimeline(nodes:NodeResource[]) {
        nodes.forEach((n:NodeResource) => {
            let minDate = null;
            if (!n.getDataEntity().getData("min_date_timeline")) {
                let edgesOfNode = n.getEdges();
                edgesOfNode.forEach((e:EdgeAbstract) => {

                    if (e.constructor !== EdgeResourceResourceOfUserVisited)
                        return;

                    let date = null;
                    if (e.getSourceNode().getUniqueId() === n.getUniqueId())
                        date = new Date(<string>e.getConnectionEntity().getData("startdate"));
                    else
                        date = new Date(<string>e.getConnectionEntity().getData("enddate"));
                    if (minDate === null) {
                        minDate = date;
                        return;
                    }
                    if (date < minDate)
                        minDate = date;
                });
                n.getDataEntity().setData("min_date_timeline", minDate);
            }
        });
    }


    private setResourceTimelinePositions(nodes:NodeResource[]) {

        let timelineStartX = 0;
        let timelineEndX = 2000;
        let timelineStartY = 0;
        let timelineEndY = 500;

        this.setNodesMinDateOnTimeline(nodes);
        nodes.sort(this.sortResNodesByOrderedEntityIdList.bind(this));

        let firstStartDate = nodes[0].getDataEntity().getData("min_date_timeline");
        let lastStartDate = nodes[nodes.length - 1].getDataEntity().getData("min_date_timeline");

        console.log(firstStartDate, lastStartDate);

        nodes.forEach((n:NodeResource, k) => {
            let startD = n.getDataEntity().getData("min_date_timeline");

            let timelineFactor = (startD - firstStartDate) / (lastStartDate - firstStartDate);
            let posX = timelineStartX + timelineFactor * timelineEndX;
            n.setPosition(posX, timelineStartY + (k * ((timelineEndY - timelineStartY) / nodes.length)));

        });
    }

    private setResourceOthersPositions(nodes:NodeResource[]) {

        let timelineY = 700;
        let seperationStep = 50;

        let usedPositions = {};

        nodes.forEach((n:NodeResource) => {

            let connectedTimelineNodesMinX = null;
            let connectedTimelineNodesMaxX = null;
            n.getEdges().forEach((e:EdgeAbstract) => {

                if (e.constructor !== EdgeResourceResourceGeneral)
                    return;
                let otherNode:NodeAbstract = null;
                if (e.getSourceNode().getUniqueId() === n.getUniqueId())
                    otherNode = e.getDestNode();
                else
                    otherNode = e.getSourceNode();

                let posOtherNode = otherNode.getPosition();
                if (connectedTimelineNodesMinX === null || posOtherNode["x"] < connectedTimelineNodesMinX)
                    connectedTimelineNodesMinX = posOtherNode["x"];
                if (connectedTimelineNodesMaxX === null || posOtherNode["x"] > connectedTimelineNodesMaxX)
                    connectedTimelineNodesMaxX = posOtherNode["x"];
            });

            let xPos = Math.round((connectedTimelineNodesMaxX - connectedTimelineNodesMinX) / 2);
            let yPos = timelineY;


            // Register the X-Position.
            // If another node wants to use the same, shift the Y pos to prevent overlap
            if (typeof usedPositions[xPos] === "undefined") {
                usedPositions[xPos] = 0;
            }
            usedPositions[xPos]++;
            yPos += (usedPositions[xPos] - 1 ) * seperationStep;


            n.setPosition(xPos, yPos);
        });
        console.log(usedPositions);
    }

    private setTagPositions(nodes:NodeTag[]) {
        let timelineY = -100;


        nodes.forEach((n:NodeTag) => {
            let tagEdgesCounted = 0;
            let lastResNode = null;

            let connectedTimelineNodesMinX = null;
            let connectedTimelineNodesMaxX = null;
            n.getEdges().forEach((e:EdgeAbstract) => {

                if (e.constructor !== EdgeResourceTag) {
                    return;
                }
                let otherNode:NodeAbstract = null;
                if (e.getSourceNode().getUniqueId() === n.getUniqueId())
                    otherNode = e.getDestNode();
                else
                    otherNode = e.getSourceNode();

                let posOtherNode = otherNode.getPosition();
                if (connectedTimelineNodesMinX === null || posOtherNode["x"] < connectedTimelineNodesMinX)
                    connectedTimelineNodesMinX = posOtherNode["x"];
                if (connectedTimelineNodesMaxX === null || posOtherNode["x"] > connectedTimelineNodesMaxX)
                    connectedTimelineNodesMaxX = posOtherNode["x"];

                tagEdgesCounted++;
                lastResNode = otherNode;
            });

            if (tagEdgesCounted === 1 || (connectedTimelineNodesMaxX - connectedTimelineNodesMinX) < 1.0) {
                n.setPosition(lastResNode.getPosition()['x'], timelineY);
                return;
            }
            n.setPosition((connectedTimelineNodesMaxX - connectedTimelineNodesMinX) / 2, timelineY);

        });
    }


    public reCalculateLayout(onFinish):void {
        this.calculate(true, onFinish);
    }
}