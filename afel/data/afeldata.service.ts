import {DataService} from "../../gvfcore/services/data.service";
import {AfelDataSourceSolr} from "./solr/afeldatasourcesolr";
import {AfelDataSourceInterace} from "./datasource_interface";
import {AfelDataSourceGnoss} from "./gnossdata/afeldatasourcegnoss";
import {Plane} from "../../gvfcore/components/plane/plane";
import {AfelResourceDataEntity} from "../graph/data/resource";
import {UiService} from "../../gvfcore/services/ui.service";
import {AfelLearnerDataEntity} from "../graph/data/learner";
import {ResourceResourceContentBasedSimilar} from "../graph/data/connections/resresCbSimilar";
import {GraphLayoutFdlQuadtreeCompleteAfelGraph} from "../graph/layouts/completegraphfdlquadtree";
import {NodeAbstract} from "../../gvfcore/components/graphvis/graphs/nodes/nodeelementabstract";
export class AfelDataService {

    static instance:AfelDataService;
    static isCreating:Boolean = false;
    private dataSource:AfelDataSourceInterace;

    constructor() {
        if (!AfelDataService.isCreating) {
            return AfelDataService.getInstance();
        }
        // this.dataSource = new AfelDataSourceSolr(null);
        this.dataSource = new AfelDataSourceGnoss(null);
    }

    static getInstance() {
        if (AfelDataService.instance == null) {
            AfelDataService.isCreating = true;
            AfelDataService.instance = new AfelDataService();
            AfelDataService.isCreating = false;
        }
        return AfelDataService.instance;
    }


    getDataSource() {
        return this.dataSource;
    }


    addButtonLoadResourcesByLearner(learnerEntityId, plane:Plane) {
        let callFct = function (onFinish) {
            (<AfelDataSourceGnoss>AfelDataService.getInstance().getDataSource()).loadResourcesOfUser(learnerEntityId, function (status, addedData) {
                plane.getGraph().addGraphElements(addedData);
                let newResIds = [];
                for (let dataKey in addedData) {
                    let addedElement = addedData[dataKey];
                    if (!(addedElement instanceof AfelResourceDataEntity))
                        continue;
                    newResIds.push(addedElement.getId());
                }
                plane.getGraph().getLayout().calculateLayout(function () {
                }, addedData);

                (<AfelDataSourceGnoss>AfelDataService.getInstance().getDataSource()).loadResourcesConnectionsToUsers(newResIds, function (statusC, addedConnections) {
                    plane.getGraph().addGraphElements(addedConnections);
                    plane.getGraph().getLayout().calculateLayout(function () {
                    }, addedConnections);
                    if (onFinish) {
                        onFinish();
                    }
                }.bind(this));
            }.bind(this));
        };

        let button = {
            id: "loadresbylearner_" + learnerEntityId,
            title: "Load further learned resources",
            fct: function (onFinish) {
                callFct(onFinish);
            }
        };

        UiService.getInstance().topButtons.push(button);
        return button;
    }

    addButtonLoadResourcesContentBasedRecommended(res:AfelResourceDataEntity, plane:Plane) {
        let resourceHashId = res.getData("res_hash");
        let callFct = function (onFinish) {
            (<AfelDataSourceGnoss>AfelDataService.getInstance().getDataSource()).loadContentBasedRecommendedResources(resourceHashId, function (status, addedData) {

                // plane.getGraph().addGraphElements(addedData);

                let newResIds = [];
                for (let dataKey in addedData) {
                    let addedElement = <AfelResourceDataEntity>addedData[dataKey];
                    if (!(addedElement instanceof AfelResourceDataEntity))
                        continue;
                    newResIds.push(addedElement.getId());

                    let conn = new ResourceResourceContentBasedSimilar(null, res, addedElement, {});
                    res.addConnection(conn);
                    addedElement.addConnection(conn);
                }


                // plane.getGraph().getLayout().calculateLayout(function () {
                // }, addedData);

                (<AfelDataSourceGnoss>AfelDataService.getInstance().getDataSource()).loadResourcesConnectionsToResources(newResIds, function (statusC, addedConnections) {
                    // console.log("After getting new resources", newResIds, " these are the connections to it after second call", addedConnections);
                    // plane.getGraph().addExplicitListOfConnections(addedConnections);
                    plane.getGraph().addGraphElements(addedData);
                    let calcLayout = GraphLayoutFdlQuadtreeCompleteAfelGraph.quadTreeLayout(<NodeAbstract[]>plane.getGraph().getGraphElements(), addedData);
                    calcLayout["nodeData"].forEach((d) => {
                        // Calcuation also includes old nodes...
                        if (newResIds.indexOf(d.node.getDataEntity().getId()) < 0)
                            return;
                        (<NodeAbstract>d.node).setPosition(d.pos['x'], d.pos['y']);
                    });
                    plane.getGraphScene().render();
                    // plane.getGraph().getLayout().calculateLayout(function () {
                    // }, addedConnections);
                    if (onFinish) {
                        onFinish();
                    }
                }.bind(this));
            }.bind(this));
        };

        let button = {
            id: "loadcbrecres_" + resourceHashId,
            title: "Load further content-based recommended resources",
            fct: function (onFinish) {
                callFct(onFinish);
            }
        };

        UiService.getInstance().topButtons.push(button);
        return button;
    }

    addButtonLoadLearnersByResource(resourceEntityId, plane:Plane) {
        let callFct = function (onFinish) {
            (<AfelDataSourceGnoss>AfelDataService.getInstance().getDataSource()).loadUsersOfResource(resourceEntityId, function (status, addedData) {

                plane.getGraph().addGraphElements(addedData);

                let newUserIds = [];
                for (let dataKey in addedData) {
                    let addedElement = addedData[dataKey];
                    if (!(addedElement instanceof AfelLearnerDataEntity))
                        continue;
                    newUserIds.push(addedElement.getId());
                }
                plane.getGraph().getLayout().calculateLayout(function () {
                }, addedData);

                (<AfelDataSourceGnoss>AfelDataService.getInstance().getDataSource()).loadUsersConnections(newUserIds, function (statusC, addedConnections) {

                    plane.getGraph().addGraphElements(addedConnections);
                    plane.getGraph().getLayout().calculateLayout(function () {
                    }, addedConnections);
                    if (onFinish) {
                        onFinish();
                    }
                }.bind(this));
            }.bind(this));
        };

        let button = {
            id: "loadlearnerbyres_" + resourceEntityId,
            title: "Load further learners of resource",
            fct: function (onFinish) {
                callFct(onFinish);
            }
        };

        UiService.getInstance().topButtons.push(button);
        return button;
    }


    addButtonLoadResourcesByTag(tagEntityId, plane:Plane) {

        let callFct = function (onFinish) {
            (<AfelDataSourceGnoss>AfelDataService.getInstance().getDataSource()).loadResourcesOfTag(tagEntityId, function (status, addedData) {
                plane.getGraph().addGraphElements(addedData);
                let newResIds = [];
                for (let dataKey in addedData) {
                    let addedElement = addedData[dataKey];
                    if (!(addedElement instanceof AfelResourceDataEntity))
                        continue;
                    newResIds.push(addedElement.getId());
                }
                plane.getGraph().getLayout().calculateLayout(function () {
                }, addedData);

                (<AfelDataSourceGnoss>AfelDataService.getInstance().getDataSource()).loadResourcesConnectionsToUsers(newResIds, function (statusC, addedConnections) {
                    plane.getGraph().addGraphElements(addedConnections);
                    plane.getGraph().getLayout().calculateLayout(function () {
                    }, addedConnections);
                    if (onFinish) {
                        onFinish();
                    }
                }.bind(this));
            }.bind(this));
        };

        let button = {
            id: "loadresourcesbytag_" + tagEntityId,
            title: "Load further resources of this tag",
            fct: function (onFinish) {
                callFct(onFinish);
            }
        };
        UiService.getInstance().topButtons.push(button);
        return button;
    }
}