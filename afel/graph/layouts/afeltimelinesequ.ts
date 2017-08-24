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
import {NodeDynAction} from "../graphs/nodes/dynaction";
import {AfelDynActionDataEntity} from "../data/dynaction";
import {AfelMetanodeResources} from "../graphs/metanodes/resGroup";
import {EdgeBasic} from "../../../gvfcore/components/graphvis/graphs/edges/edgeelementbasic";
import {EdgeResourceMetaGroup} from "../graphs/edges/resourcemetagroup";
import {AfelTimeLineGrid, AFEL_TIMELINEGRID_TIMESCALE} from "./timeline/timelinegrid";
import {BasicConnection} from "../../../gvfcore/components/graphvis/data/databasicconnection";
import {DynActionResConnection} from "../data/connections/dynactionRes";
export class GraphLayoutAfelTimelineSequence extends GraphLayoutAbstract {

    private connectedEntityIdsOrderOnTimeline = null;

    private timelineStartX = 0;
    private timelineEndX = 2000;
    private timelineStartY = 0;
    private timelineEndY = 500;

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
        let tmpDynActionNodes:NodeDynAction[] = [];

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

                case AfelDynActionDataEntity:
                    tmpDynActionNodes.push(<NodeDynAction>n);
                    break;

                default :
                    console.warn("Timeline-Layout: Data entity '" + n.getDataEntity().constructor.name + "' not found");
            }
        });


        let mNs = this.createAndSetResourceMetanodePositions(tmpResourcesOnTimeline);
        this.setResourceOthersPositions(tmpResourcesOthers);
        this.setTagPositions(tmpTagNodes);
        this.setDynActionNodesOnTimeline(tmpDynActionNodes);
        this.setResourceTimelinePositions(tmpResourcesOnTimeline);
        this.collapseMetaNodes(mNs);
        this.createTimelineGrid(mNs, tmpDynActionNodes);

    }

    /**
     * Creating the grid of the timeline
     * @param metaNodes
     * @param dynNodes
     */
    private createTimelineGrid(metaNodes:AfelMetanodeResources[], dynNodes:NodeDynAction[]) {

        console.log("CREATE GRID!", metaNodes, dynNodes);
        let startDate = new Date(<string>dynNodes[0].getDataEntity().getData("action_date"));
        let endDate = new Date(<string>dynNodes[dynNodes.length - 1].getDataEntity().getData("action_date"));
        let width = this.timelineEndX - this.timelineStartX;
        let height = this.timelineEndY - this.timelineStartY;

        let sliceNum = metaNodes.length;

        let timelineGrid = new AfelTimeLineGrid(startDate, endDate, width, height, sliceNum,
            AFEL_TIMELINEGRID_TIMESCALE.MONTHLY,
            this.plane,
            {});

        this.plane.getGraphScene().addObject(timelineGrid);
    }

    /**
     * Sortin function for dynamic actions by their date
     * @param dNode1
     * @param dNode2
     * @returns {number}
     */
    private sortDynDatasByDateFct(dNode1:NodeDynAction, dNode2:NodeDynAction) {

        let date1 = new Date(<string>dNode1.getDataEntity().getData("action_date"));
        let date2 = new Date(<string>dNode2.getDataEntity().getData("action_date"));
        return date1 < date2 ? -1 : 1;
    }

    /**
     * Dynamic actions are shown on the timeline, while their y-Position is defined by their resource's group-node.
     * The x-position relates to the 'action_date'
     * @param nodes
     */
    private setDynActionNodesOnTimeline(nodes:NodeDynAction[]) {

        let timelineStartX = 10;
        let timelineEndX = 2000;
        nodes.sort(this.sortDynDatasByDateFct);
        let firstDate = new Date(<string>nodes[0].getDataEntity().getData("action_date"));
        let lastDate = new Date(<string>nodes[nodes.length - 1].getDataEntity().getData("action_date"));

        nodes.forEach((n:NodeDynAction, k) => {
            let rNode = n.getConnectedResourceNode();

            // We want the position of its group-metanode to determine the y position:
            let BreakException = {};
            let groupY = null;
            try {
                rNode.getEdges().forEach((eOfR:EdgeAbstract) => {
                    if (eOfR.constructor === EdgeResourceMetaGroup) {
                        groupY = (<EdgeResourceMetaGroup>eOfR).getMetaNode().getPosition()['y'];
                        throw BreakException;
                    }
                });
            } catch (e) {
                if (e !== BreakException)
                    throw e;
            }


            let yPos = 0;
            if (groupY !== null)
                yPos = groupY;
            else
                console.warn("Could not determine the action's resource group!");

            let actionDate = new Date(<string>n.getDataEntity().getData("action_date"));
            let timelineFactor = (actionDate.getTime() - firstDate.getTime()) / (lastDate.getTime() - firstDate.getTime());

            let posX = timelineStartX + timelineFactor * timelineEndX;
            n.setPosition(posX, yPos);
        });
    }


    private collapseMetaNodes(metaNodes:AfelMetanodeResources[]) {
        metaNodes.forEach((m:AfelMetanodeResources) => {
            m.collapseNodes(false, null);
        })
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
     * We want to group the resources by their 'calculatedResourceGroup' data value which comes from the server
     * Resources should be hidden in the created meta-nodes.
     * @param nodes
     */
    private createAndSetResourceMetanodePositions(nodes:NodeResource[]):AfelMetanodeResources[] {



        let metaNodeScaleFct = 30;
        let metaNodePosX = -20;
        // GROUP RESOURCE NODES (BY CATEGORY OR WHATEVER THE SERVER CALCULATED @todo: currently DUMMY!
        let rGroups = {};
        // Push resource nodes in a group array
        nodes.forEach((n:NodeResource) => {
            let gId = n.getDataEntity().getData("calculatedResourceGroup");
            if (typeof rGroups[gId] === "undefined")
                rGroups[gId] = [];
            rGroups[gId].push(n);
        });

        console.log("GROUPS:", rGroups);

        // Create group nodes and connecting edges to their resources.
        // Resources get collapsed.
        let gCount = 0;
        let metaNodes:AfelMetanodeResources[] = [];
        let rGrLength = Object.keys(rGroups).length;
        for (let rGroupId in rGroups) {
            let metaY = (this.timelineEndY - this.timelineStartY) / rGrLength * gCount + this.timelineStartX;

            let metaNodeSize = rGroups[rGroupId].length / rGrLength * metaNodeScaleFct;
            let metaNode = new AfelMetanodeResources(metaNodePosX, metaY, rGroups[rGroupId], this.plane, metaNodeSize);
            this.plane.getGraphScene().addObject(metaNode);
            // metaNode.collapseResNodes(false, null);
            rGroups[rGroupId].forEach((rn:NodeResource) => {

                let mEdge = new EdgeResourceMetaGroup(rn, metaNode, this.plane);
                rn.addEdge(mEdge);
                metaNode.addEdge(mEdge);
                this.plane.getGraphScene().addObject(mEdge);
            });

            metaNodes.push(metaNode);
            gCount++;
        }

        return metaNodes;
    }

    /**
     * Set the position of resource nodes which were visited by the user in a row
     * @param nodes
     */
    private setResourceTimelinePositions(nodes:NodeResource[]) {

        let resNodePosY = 600;
        let nodeGridWidth = 20;
        let usedPositions = {};

        let getNodePosXFromDynActionEntity = function (da:AfelDynActionDataEntity) {
            let BreakException = {};
            let posX = null;
            try {
                da.getRegisteredGraphElements().forEach((node:NodeDynAction) => {
                    if (node.getPlane().getId() !== this.plane.getId())
                        return;

                    posX = node.getPosition()['x'];
                    throw BreakException;
                });
            } catch (e) {
                if (e !== BreakException)
                    throw e;
            }

            return posX;
        }.bind(this);

        nodes.forEach((n:NodeResource, k) => {

            let minDate = null;
            let maxDate = null;
            n.getDataEntity().getConnections().forEach((c:BasicConnection) => {
                if (c.constructor !== DynActionResConnection)
                    return;

                let dynAct = (<DynActionResConnection>c).getDynAction();
                let actionDate = new Date(<string>dynAct.getData("action_date"));
                if (minDate === null || actionDate.getTime() < minDate.t)
                    minDate = {t: actionDate.getTime(), a: dynAct};
                if (maxDate === null || actionDate.getTime() > maxDate.t)
                    maxDate = {t: actionDate.getTime(), a: dynAct};
            });

            let posX;
            if (minDate.t === maxDate.t) {
                posX = getNodePosXFromDynActionEntity(<AfelDynActionDataEntity>minDate.a);
            } else {
                let posX1 = getNodePosXFromDynActionEntity(<AfelDynActionDataEntity>minDate.a);
                let posX2 = getNodePosXFromDynActionEntity(<AfelDynActionDataEntity>maxDate.a);
                posX = (posX1 + posX2) / 2.0;
            }


            posX = Math.round(posX / nodeGridWidth) * nodeGridWidth;
            if (typeof usedPositions[posX] === "undefined")
                usedPositions[posX] = 0;
            usedPositions[posX]++;

            let posY = resNodePosY + (usedPositions[posX] - 1) * nodeGridWidth;

            n.setPosition(posX, posY);
        });


    }

    /**
     * Set all other resource nodes (e.g. recommended ones for later visit...)
     * @param nodes
     */
    private setResourceOthersPositions(nodes:NodeResource[]) {

        let timelineY = 700;
        let seperationStep = 50;

        let usedPositions = {};

        nodes.forEach((n:NodeResource) => {

            // For now hide them
            n.setIsVisible(false);
            return;

            /*
             let connectedTimelineNodesMinX = null;
             let connectedTimelineNodesMaxX = null;
             let lastNode:NodeAbstract = null;
             let resEdgeCount = 0;
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

             resEdgeCount++;
             lastNode = otherNode;
             });

             let xPos, yPos;
             yPos = timelineY;
             // If the res is only connected to one resource, place it directly over it
             if (resEdgeCount === 1 || (connectedTimelineNodesMaxX - connectedTimelineNodesMinX) < 1.0) {
             xPos = Math.round(lastNode.getPosition()['x']);
             } else {
             xPos = Math.round((connectedTimelineNodesMaxX - connectedTimelineNodesMinX) / 2 + connectedTimelineNodesMinX);
             }


             // Register the X-Position.
             // If another node wants to use the same, shift the Y pos to prevent overlap
             if (typeof usedPositions[xPos] === "undefined") {
             usedPositions[xPos] = 0;
             }
             usedPositions[xPos]++;
             yPos += (usedPositions[xPos] - 1 ) * seperationStep;


             n.setPosition(xPos, yPos);

             */
        });
        console.log(usedPositions);
    }


    private orderTagsByWeightFct(a:NodeTag, b:NodeTag) {
        return (a.getDataEntity().getData("weight") > b.getDataEntity().getData("weight") ? -1 : 1);
    }

    /**
     * Set the position of TAG-Nodes below the timeline
     * @param nodes
     */
    private setTagPositions(nodes:NodeTag[]) {
        let timelineY = -100;
        let seperationStep = 50;

        let usedPositions = {};
        nodes.sort(this.orderTagsByWeightFct);

        nodes.forEach((n:NodeTag) => {

            // For now hide them
            n.setIsVisible(false);
            return;
            /*
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


             let xPos, yPos;
             yPos = timelineY;
             // If the tag is used only by one resource, place it directly underneath it
             if (tagEdgesCounted === 1 || (connectedTimelineNodesMaxX - connectedTimelineNodesMinX) < 1.0) {
             xPos = Math.round(lastResNode.getPosition()['x']);
             } else
             xPos = Math.round((connectedTimelineNodesMaxX - connectedTimelineNodesMinX) / 2 + connectedTimelineNodesMinX);

             // Register the X-Position.
             // If another node wants to use the same, shift the Y pos to prevent overlap
             if (typeof usedPositions[xPos] === "undefined") {
             usedPositions[xPos] = 0;
             }
             usedPositions[xPos]++;
             yPos -= (usedPositions[xPos] - 1 ) * seperationStep;
             n.setPosition(xPos, yPos);
             */
        });
    }


    public reCalculateLayout(onFinish):void {
        this.calculate(true, onFinish);
    }
}