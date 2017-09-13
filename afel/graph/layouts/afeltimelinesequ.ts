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
import {EdgeDynactionRes} from "../graphs/edges/dynactionres";
import {BasicGroup} from "../../../gvfcore/components/graphvis/data/databasicgroup";
import {BasicEntity} from "../../../gvfcore/components/graphvis/data/databasicentity";
import {ElementAbstract} from "../../../gvfcore/components/graphvis/graphs/graphelementabstract";
import {AfelMetanodeDynActions} from "../graphs/metanodes/dynActionGroup";
import {EdgeDynActionMetaGroup} from "../graphs/edges/dynactionmetagroup";
import {DynActionShadowNode} from "../graphs/nodes/dynactionshadownode";
import {GraphLayoutFdlQuadtree} from "../../../gvfcore/components/graphvis/graphs/layouts/graphlayoutfdlquadtree";
import {ButtonSimple} from "../../../gvfcore/components/graphvis/graphs/buttons/buttonsimple";
import {ButtonShowAllResources} from "../graphs/buttons/buttonShowAllResources";
import {ButtonHideAllResources} from "../graphs/buttons/buttonHideAllResources";
import {ButtonHideAllDynActions} from "../graphs/buttons/buttonHideAllDynNodes";
import {ButtonShowAllDynActions} from "../graphs/buttons/buttonShowAllDynNodes";
export class GraphLayoutAfelTimelineSequence extends GraphLayoutAbstract {

    private connectedEntityIdsOrderOnTimeline = null;

    private timelineStartX = 0;
    private timelineEndX = 2000;
    private timelineStartY = 0;
    private timelineEndY = 500;
    private timelineScale = AFEL_TIMELINEGRID_TIMESCALE.MONTHLY;
    private dynActionRasterSize = 40;
    private dynNodeBelowTimelineYPos = -200;
    private resourceMetanodesRasterSize = 30;
    private resourceMetanodesX = -40;
    private resourceNodeYMin = -550;
    private resourceNodeRasterSize = 30;

    constructor(protected plane:Plane, nodes:NodeAbstract[], edges:EdgeAbstract[]) {
        super(plane, nodes, edges);
    }

    public setInitPositions(onFinish):void {
        onFinish();
    }


    public calculateLayout(onFinish, newNodes = null):void {

        if (newNodes) {
            alert("TODO: Handle added nodes!");
        }

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

        if (!newNodes) {
            console.log("CR SET RES METANODES");
            let mNs = this.createAndSetResourceMetanodePositions(tmpResourcesOnTimeline);
            console.log("SET OTHER RES POS");
            this.setResourceOthersPositions(tmpResourcesOthers);
            console.log("SET DYN ACTION POS");
            this.setDynActionNodesOnTimeline(tmpDynActionNodes);
            console.log("CR SET DYN ACTION METANODES");
            this.createAndSetDynActionMetanodes(mNs);
            console.log("SET RES POS");
            this.setResourceTimelinePositions(tmpResourcesOnTimeline);
            console.log("SET TAG POS");
            this.setTagPositions(tmpTagNodes, tmpResourcesOnTimeline);
            console.log("COLL RES METANODES");
            this.collapseResourceMetaNodes(mNs);
            console.log("CR TIMELINE GRID");
            this.createTimelineGrid(mNs, tmpDynActionNodes);
            console.log("CR BUTTONS");
            this.createButtons(mNs.length);
        } else
            this.setResourceOthersPositions(tmpResourcesOthers);


    }

    private createButtons(numResMetaNodes) {
        let buttY = this.timelineStartY - (this.timelineEndY -this.timelineStartY) / numResMetaNodes;
        let bRExp = new ButtonShowAllResources(this.resourceMetanodesX - 30, buttY, this.plane, null);
        let bRCol = new ButtonHideAllResources(this.resourceMetanodesX - 80, buttY, this.plane, null);

        let bDCol = new ButtonHideAllDynActions(this.timelineEndX + 30, buttY, this.plane, null);
        let bDExp = new ButtonShowAllDynActions(this.timelineEndX + 80, buttY, this.plane, null);
        this.plane.getGraphScene().addObject(bRExp);
        this.plane.getGraphScene().addObject(bRCol);
        this.plane.getGraphScene().addObject(bDExp);
        this.plane.getGraphScene().addObject(bDCol);
    }

    /**
     * Creating the grid of the timeline
     * @param metaNodes
     * @param dynNodes
     */
    private createTimelineGrid(metaNodes:AfelMetanodeResources[], dynNodes:NodeDynAction[]) {
        let startDate = new Date(<string>dynNodes[0].getDataEntity().getData("action_date"));
        let endDate = new Date(<string>dynNodes[dynNodes.length - 1].getDataEntity().getData("action_date"));
        let width = this.timelineEndX - this.timelineStartX;
        let height = this.timelineEndY - this.timelineStartY;

        let sliceNum = metaNodes.length;

        let timelineGrid = new AfelTimeLineGrid(startDate, endDate, width, height, sliceNum,
            this.timelineScale,
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
     * @TODO: Consider solution of dynamic actions of same group at same time. Not visible!
     * @param nodes
     */
    private setDynActionNodesOnTimeline(nodes:NodeDynAction[]) {
        if (!nodes.length)
            return;

        let timelineStartX = this.timelineStartX;
        let timelineEndX = this.timelineEndX;
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

    /**
     * Creates Metanodes holding dynamic actions to group them by Time-Range (e.g. Week / Month) and Resource-Group
     * on the timeline.
     * @param nodes
     */
    private createAndSetDynActionMetanodes(resMetaNodes:AfelMetanodeResources[]) {

        /**
         * Source: https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
         * @param d
         * @returns {number[]}
         */
        let getWeekNumber = function (d) {
            // Copy date so don't modify original
            d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
            // Set to nearest Thursday: current date + 4 - current day number
            // Make Sunday's day number 7
            d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
            // Get first day of year
            var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
            // Calculate full weeks to nearest Thursday
            var weekNo = Math.ceil(( ( (d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
            // Return array of year and week number
            return weekNo;
        };

        let resGroups = [];
        let totalDaCount = 0;
        let allCreatedDynActionNodes:NodeDynAction[] = [];
        let allCreatedDynActionMetanodes:AfelMetanodeDynActions[] = [];

        // COLLECT DYN-ACTIONS BY RESOURCE-GROUP AND TIME-SLOT
        // Iterate over all resource-metanodes
        resMetaNodes.forEach((mnR:AfelMetanodeResources, k) => {
            resGroups[k] = {
                rmn: mnR,
                das: {},
            };

            // Iterate over the metanode's resource entites


            (<BasicGroup>mnR.getDataEntity()).getEntities().forEach((r:AfelResourceDataEntity) => {

                // Iterate over the resource's connections to identify dynamic actions
                r.getConnections().forEach((c:BasicConnection) => {
                    if (c.constructor !== DynActionResConnection)
                        return;

                    let dA = (<DynActionResConnection>c).getDynAction();
                    let daDate = new Date(<string>dA.getData("action_date"));

                    let identifier;
                    switch (this.timelineScale) {

                        case AFEL_TIMELINEGRID_TIMESCALE.WEEKLY :
                            identifier = daDate.getFullYear() + "-" + getWeekNumber(daDate);
                            break;
                        case AFEL_TIMELINEGRID_TIMESCALE.MONTHLY :
                            identifier = daDate.getFullYear() + "-" + daDate.getMonth();
                            break;

                        default:
                            console.warn("Timeline scale not implemented yet!");
                            return;
                    }

                    let dANode:NodeDynAction = null;
                    dA.getRegisteredGraphElements().forEach((elm:ElementAbstract) => {
                        if (elm.getPlane().getId() !== this.plane.getId())
                            return;
                        dANode = <NodeDynAction>elm;
                    });

                    if (!dANode) {
                        console.warn("Something went wrong in finding node for dynamic action!");
                        return;
                    }

                    if (typeof resGroups[k].das[identifier] === "undefined")
                        resGroups[k].das[identifier] = {nodes: [], avg: null};
                    resGroups[k].das[identifier].nodes.push(dANode);

                    totalDaCount++;
                });

            });
        });

        /**
         * Finally create the Metanode at an average X-Position
         */

        resGroups.forEach((rg, k) => {

            let yPos = (<AfelMetanodeResources>rg.rmn).getPosition()['y'];

            for (let dKey in rg.das) {
                let avgXPos = 0;

                rg.das[dKey].nodes.forEach((dANode:NodeDynAction) => {
                    let xPos = dANode.getPosition()['x'];
                    avgXPos += xPos;
                });

                avgXPos /= rg.das[dKey].nodes.length;
                console.log("POS FOR TIMERANGE " + dKey + " IN RES-GROUP " + k + ": " + avgXPos + "/" + yPos);


                let metaNodeSize = Math.sqrt(rg.das[dKey].nodes.length / totalDaCount) * 100;

                console.log(rg.das[dKey].nodes.length, totalDaCount, metaNodeSize);
                let othersMetaNodeSize = (0.5 + Math.random()) * metaNodeSize;

                let metaNode = new AfelMetanodeDynActions(avgXPos, yPos, rg.das[dKey].nodes, this.plane, metaNodeSize, othersMetaNodeSize);
                allCreatedDynActionMetanodes.push(metaNode);
                this.plane.getGraphScene().addObject(metaNode);

                /**
                 * Create edges from Meta-Node to dynAction Nodes.
                 * Then move the dynAction-Nodes to the bottom on a raster and create shadow-Nodes on the timeline.
                 */

                rg.das[dKey].nodes.forEach((daN:NodeDynAction) => {

                    let mEdge = new EdgeDynActionMetaGroup(daN, metaNode, this.plane);
                    daN.addEdge(mEdge);
                    metaNode.addEdge(mEdge);
                    this.plane.getGraphScene().addObject(mEdge);

                    // We need all DNs in the end to show them below the timeline
                    allCreatedDynActionNodes.push(daN);
                });
            }

        });

        // After all, sort the dyn-nodes again, to show them in the right order below the timeline:
        let sharedXPosArrayForDynNodeShadows = [];
        allCreatedDynActionNodes.sort(this.sortDynDatasByDateFct);
        allCreatedDynActionNodes.forEach((daN:NodeDynAction) => {
            this.setDynNodeShadowBelowTimeline(daN, sharedXPosArrayForDynNodeShadows);
            daN.saveOrigPosition(true);
        });

        allCreatedDynActionMetanodes.forEach((mN:AfelMetanodeDynActions) => {
            mN.collapseNodes(false, null);
        });

    }


    /**
     * Since we got our aggregated meta-nodes now, there's no space for the original dyn-action nodes on the timeline.
     * We move a 'shadow' (a kind of duplicate of the node)
     * below the timeline, also to prevent overlappings (if they seem to be done at the same time).
     * @param daN
     * @param usedXPositions Array shared for all nodes of the metanode
     */
    private setDynNodeShadowBelowTimeline(daN:NodeDynAction, usedXPositions) {

        let raster = this.dynActionRasterSize;

        let xTimeline = daN.getPosition()['x'];
        let yTimeline = daN.getPosition()['y'];

        let xBelow = Math.round(xTimeline / raster) * raster;
        if (typeof usedXPositions[xBelow] === "undefined")
            usedXPositions[xBelow] = 0;
        usedXPositions[xBelow]++;
        xBelow += (usedXPositions[xBelow] - 1) * raster;

        let yBelow = this.dynNodeBelowTimelineYPos;


        let theShadow = new DynActionShadowNode(xTimeline, yTimeline, daN, this.plane, {});
        theShadow.setIsVisible(false);
        daN.setPosition(xBelow, yBelow);
        this.plane.getGraphScene().addObject(theShadow);
        daN.addShadowNode(theShadow);


        // daN.setPosition(daN.getPosition()['x'], -200);
    }


    private collapseResourceMetaNodes(metaNodes:AfelMetanodeResources[]) {
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


        let metaNodeScaleFct = this.resourceMetanodesRasterSize;
        let metaNodePosX = this.resourceMetanodesX;

        let rGroups = [];
        // Push resource nodes in a group array
        nodes.forEach((n:NodeResource) => {
            let gId = n.getDataEntity().getData("clusterGroup");
            if (typeof rGroups[gId] === "undefined")
                rGroups[gId] = [];
            rGroups[gId].push(n);
        });

        /**
         * Sorting the resource-meta-node groups, to be sure that they are ordered in a way,
         * that the average date of their resources' dynActions are stacked from the bottom to the top
         * @param g1
         * @param g2
         * @returns {number}
         */
        let rnGroupSortFct = function (g1:NodeResource[], g2:NodeResource[]) {
            let getAvgTimeFct = function (group:NodeResource[]) {
                let sumD = 0;
                let totalDynActionCountOfResources = 0;
                group.forEach((n:NodeResource) => {

                    n.getEdges().forEach((e:EdgeBasic) => {
                        if (e.constructor !== EdgeDynactionRes)
                            return;
                        let nDa = <NodeDynAction>e.getDestNode();
                        let d = new Date(<string>nDa.getDataEntity().getData("action_date"));
                        sumD += d.getTime();
                        totalDynActionCountOfResources++;
                    });
                });
                return sumD / totalDynActionCountOfResources;
            };
            let avgTime1 = getAvgTimeFct(g1);
            let avgTime2 = getAvgTimeFct(g2);
            return avgTime1 < avgTime2 ? -1 : 1;
        };

        rGroups.sort(rnGroupSortFct);
        console.log(rGroups);

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

        let resNodePosY = this.resourceNodeYMin;
        let nodeGridWidth = this.resourceNodeRasterSize;
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

            let posY = resNodePosY - (usedPositions[posX] - 1) * nodeGridWidth;

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
        // console.log(usedPositions);
    }


    private orderTagsByWeightFct(a:NodeTag, b:NodeTag) {
        return (a.getDataEntity().getData("weight") > b.getDataEntity().getData("weight") ? -1 : 1);
    }

    /**
     * Set the position of TAG-Nodes below the timeline
     * @param nodes                 Tag Nodes
     * @param fixedResourceNodes    Important to give the resourcenodes to set them on the right pos
     */
    private setTagPositions(nodes:NodeTag[], fixedResourceNodes:NodeResource[]) {

        // nodes.forEach((nT:NodeTag) => {
        //     nT.setIsVisible(false);
        // });
        // this.plane.getGraphScene().render();

        let nodesIncRes = [];
        nodes.forEach((nT:NodeTag) => {
            nodesIncRes.push(nT);
        });
        fixedResourceNodes.forEach((nR:NodeResource) => {
            nodesIncRes.push(nR);
        });


        let tagEntityIdsToFix = {};
        nodes.forEach((nT:NodeTag) => {
            let dId = nT.getDataEntity().getId();
            // Just the key is important... value can be anything
            tagEntityIdsToFix[dId] = dId;
        });

        console.log("QUADTREE START");
        let qTCalculatedData = GraphLayoutFdlQuadtree.quadTreeLayout(nodesIncRes, tagEntityIdsToFix, null, true);
        console.log("QUADTREE END");
        let rect = qTCalculatedData.rect;

        qTCalculatedData.nodeData.forEach(function (nData) {
            let pos = nData.pos;
            let node = nData.node;
            node.setPosition(pos.x, pos.y);
            node.setIsVisible(false);
        }.bind(this));


        return;
    }


    public reCalculateLayout(onFinish):void {
        this.calculate(true, onFinish);
    }
}