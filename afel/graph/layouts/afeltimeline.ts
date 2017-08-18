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
export class GraphLayoutAfelTimeline extends GraphLayoutAbstract {


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

        // tmpResourcesOnTimeline = plane.getLearnerPath()

        this.setResourceTimelinePositions(tmpResourcesOnTimeline);
        this.setResourceOthersPositions(tmpResourcesOthers);
        this.setTagPositions(tmpTagNodes);
    }

    /**
     * Sort Fct to sort a list of nodes by their minimal start-date in one of their edges' entities.
     * Additionaly sets the min-start date as a data-variable ('min_date_timeline') in the node's entity.
     * @param a
     * @param b
     * @returns {number}
     */
    private sortResNodesByFirstOccurenceOfStartDateFct(a:NodeResource, b:NodeResource) {
        // Two ways to sort:
        // B) By dates
        // A) By checking connecting edges


        // B) - Not directly connected. Sorting must be done by date

        let minDateA = null;

        if (!a.getDataEntity().getData("min_date_timeline")) {
            let edgesOfNodeA = a.getEdges();
            edgesOfNodeA.forEach((e:EdgeAbstract) => {

                if (e.constructor !== EdgeResourceResourceOfUserVisited)
                    return;

                let date = null;
                if (e.getSourceNode().getUniqueId() === a.getUniqueId())
                    date = new Date(<String>e.getConnectionEntity().getData("startdate"));
                else
                    date = new Date(<String>e.getConnectionEntity().getData("enddate"));
                if (minDateA === null) {
                    minDateA = date;
                    return;
                }
                if (date < minDateA)
                    minDateA = date;
            });
            a.getDataEntity().setData("min_date_timeline", minDateA);
        } else
            minDateA = a.getDataEntity().getData("min_date_timeline");


        let minDateB = null;

        if (!b.getDataEntity().getData("min_date_timeline")) {
            let edgesOfNodeB = b.getEdges();
            edgesOfNodeB.forEach((e:EdgeAbstract) => {

                if (e.constructor !== EdgeResourceResourceOfUserVisited)
                    return;

                let date = null;
                if (e.getSourceNode().getUniqueId() === b.getUniqueId())
                    date = new Date(<String>e.getConnectionEntity().getData("startdate"));
                else
                    date = new Date(<String>e.getConnectionEntity().getData("enddate"));
                if (minDateB === null) {
                    minDateB = date;
                    return;
                }
                if (date < minDateB)
                    minDateB = date;
            });

            b.getDataEntity().setData("min_date_timeline", minDateB);

        } else
            minDateB = b.getDataEntity().getData("min_date_timeline");



        if (minDateA.getTime() == minDateB.getTime()) {
            console.log("TRY BY CONNECTION!");
            // A) - Let's see if they are connected directly to easily identify the sorting.
            // Necessary if the two dates are the same
            let sortByEdges = null;
            let BreakException = {};
            try {

                a.getEdges().forEach((e:EdgeAbstract) => {

                    if (e.constructor !== EdgeResourceResourceOfUserVisited)
                        return;

                    if (e.getSourceNode().getUniqueId() === a.getUniqueId() && e.getDestNode().getUniqueId() === b.getUniqueId()) {
                        sortByEdges = -1;
                        throw BreakException;
                    }
                    if (e.getSourceNode().getUniqueId() === b.getUniqueId() && e.getDestNode().getUniqueId() === a.getUniqueId()) {
                        sortByEdges = 1;
                        throw BreakException;
                    }
                });

            } catch (e) {
                if (e !== BreakException)
                    throw e;
            }

            if (sortByEdges !== null)
                return sortByEdges;
        }




        return (minDateA < minDateB ? -1 : (minDateA > minDateB ? 1 : 0));
    }

    private setResourceTimelinePositions(nodes:NodeResource[]) {

        let timelineStartX = 0;
        let timelineEndX = 2000;
        let timelineStartY = 0;
        let timelineEndY = 500;


        let timelineTagY = -300;


        nodes.sort(this.sortResNodesByFirstOccurenceOfStartDateFct);


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
            yPos += (usedPositions[xPos] -1 ) * seperationStep;


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