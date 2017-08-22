import {AfelDataSourceInterace} from "../datasource_interface";
import {DataService} from "../../../gvfcore/services/data.service";
import {AfelResourceDataEntity} from "../../graph/data/resource";
import {AfelLearnerDataEntity} from "../../graph/data/learner";
import {LearningActivity} from "../../graph/data/connections/learningactivity";
import {AfelTagDataEntity} from "../../graph/data/tag";
import {ResourceTagConnection} from "../../graph/data/connections/resourcetag";
import {BasicEntity} from "../../../gvfcore/components/graphvis/data/databasicentity";
import raw = require("core-js/fn/string/raw");
import {ResourceResourceTransitionConnectionOfUserVisited} from "../../graph/data/connections/resresUserGenerated";
import {ResourceResourceTransitionConnectionGeneral} from "../../graph/data/connections/resresGeneral";
import {AfelDynActionDataEntity} from "../../graph/data/dynaction";
import {DynActionResConnection} from "../../graph/data/connections/dynactionRes";
import {DynActionDynActionConnection} from "../../graph/data/connections/dynactionDynAction";


export class AfelDataSourceGnoss implements AfelDataSourceInterace {


    private http;
    private url = "http://localhost:8082";
    private urlPaths = {
        init: "/",
        resource: "/resource",
        user: "/user",
        tag: "/tag"
    };

    private currentUserId = 1;


    private dataMapping = {
        "User": AfelLearnerDataEntity,
        "Resource": AfelResourceDataEntity,
        "Tag": AfelTagDataEntity,
        "DynAction": AfelDynActionDataEntity,
        "HAS_TAG": ResourceTagConnection,
        "USER_RESOURCE_ACTION": LearningActivity,
        "RES_RES_USERTRANS": ResourceResourceTransitionConnectionOfUserVisited,
        "RES_TRANS": ResourceResourceTransitionConnectionGeneral,
        "ACTION_ON_RESOURCE": DynActionResConnection,
        "DYNACTION_DYNACTION_CONNECTION": DynActionDynActionConnection
    };


    constructor(private dataContainer) {
        this.http = DataService.getInstance().getHttp();

    }

    public fetchInitDataFromServer(cb = null) {

        let postDataInit = {
            method: "getInitGraph",
            data: {
                userId: this.currentUserId,
                count: 500,
                createUserResResTransition: true
            }
        };

        /**
         * Get init network first
         */
        this.makeCall(this.url + this.urlPaths.init, postDataInit, function (someBool, fetchedInitData) {

            console.log("initdata", fetchedInitData);

            let fetchedResIds = [];
            for (let fIKey in fetchedInitData) {
                if (!(fetchedInitData[fIKey] instanceof AfelResourceDataEntity))
                    continue;
                fetchedResIds.push(fetchedInitData[fIKey].getId());
            }

            console.log(fetchedResIds);
            let postDataInitTrans = {
                method: "getResourcesWithBestTransition",
                data: {
                    resourceIds: fetchedResIds,
                    count: 300,
                    minWeight: 0
                }
            };

            /**
             * After that, load additional resources, which have a good transition from the user's learned ones
             */
            this.makeCall(this.url + this.urlPaths.resource, postDataInitTrans, function (someBool, fetchedNewTransRes) {

                let fetchedNewResIds = [];
                for (let fIKey in fetchedNewTransRes) {
                    if (!(fetchedNewTransRes[fIKey] instanceof AfelResourceDataEntity))
                        continue;
                    fetchedNewResIds.push(fetchedNewTransRes[fIKey].getId());
                }

                /**
                 * Finally get the connections of the new resources
                 */
                this.loadResourcesConnectionsToResources(fetchedNewResIds, function (status, addedConnections) {
                    if (cb) {
                        cb();
                    }
                });
            }.bind(this));
        }.bind(this));
    }


    public fetchGlobalResourceTransitionNetwork(cb = null) {

        let postData = {
            method: "getGlobalResourceTransitionGraph",
            data: {
                count: 100
            }
        };

        this.makeCall(this.url + this.urlPaths.resource, postData, function (someBool, fetchedData) {
            let fetchedNewResIds = [];
            for (let fKey in fetchedData) {
                (<BasicEntity>fetchedData[fKey]).setData("is_res_trans_nw_data", true);
                if (fetchedData[fKey] instanceof AfelResourceDataEntity)
                    fetchedNewResIds.push(fetchedData[fKey].getId());
            }

            // this.loadResourcesConnectionsToResources(fetchedNewResIds, function (status, addedConnections) {
            //     if (cb) {
            //         cb();
            //     }
            // });

            if (cb) {
                cb();
            }

        }.bind(this));

    }

    public loadUsersOfResource(resourceId, cb) {
        let postData = {
            method: "getUsers",
            data: {
                resourceId: resourceId,
                count: 500,
                ignoredUsers: [this.currentUserId]
            }
        };
        this.makeCall(this.url + this.urlPaths.resource, postData, cb);
    }

    public loadUsersConnections(newUserIds, cb) {
        let postData = {
            method: "getUsersConnections",
            data: {
                userIds: newUserIds
            }
        };
        this.makeCall(this.url + this.urlPaths.user, postData, cb);
    }


    public loadResourcesOfUser(userId, cb) {
        let postData = {
            method: "getResources",
            data: {
                userId: userId,
                count: 500
            }
        };
        this.makeCall(this.url + this.urlPaths.user, postData, cb);
    }

    public loadResourcesConnectionsToUsers(newResourceIds, cb) {
        let postData = {
            method: "getResourcesConnectionsToUsers",
            data: {
                resourceIds: newResourceIds
            }
        };
        this.makeCall(this.url + this.urlPaths.resource, postData, cb);
    }

    public loadResourcesConnectionsToResources(newResourceIds, cb) {
        let postData = {
            method: "getResourcesConnectionsToResources",
            data: {
                resourceIds: newResourceIds
            }
        };
        this.makeCall(this.url + this.urlPaths.resource, postData, cb);
    }

    public loadResourcesOfTag(tagId, cb) {
        let postData = {
            method: "getResources",
            data: {
                tagId: tagId,
                count: 500
            }
        };
        this.makeCall(this.url + this.urlPaths.tag, postData, cb);
    }


    protected makeCall(url, data, cb) {
        this.http.post(url, data)
            .map(res => res.json())
            .toPromise()
            .then((res) => {
                console.log("CALL MADE:", url, data, res);

                if (res["data"] !== null) {
                    let addedData = this.storeResponseData(res);

                    if (cb)
                        cb(true, addedData);
                }
                else if (cb) {
                    if (res["error"])
                        console.error("ERROR on API CALL:", res["error"]);
                    cb(false, null);
                }


            }, (r) => {
                console.error("ERROR on API CALL", r);
                cb(false, null)
            });
    }

    public storeResponseData(res) {
        let dataIdMapping = {};

        console.log(res);
        if (typeof res["data"]["nodes"] !== "undefined") {

            for (let nTypeK in res["data"]["nodes"]) {
                let entityClass = this.dataMapping[nTypeK];

                if (!entityClass) {
                    console.warn("No dataentity class for type '" + nTypeK + "' found. Skipping");
                    continue;
                }

                let serverNodeList = res["data"]["nodes"][nTypeK];

                switch (entityClass) {
                    default:
                        serverNodeList.forEach((serverNode) => {
                            let serverNodeId = serverNode["id"];

                            if (typeof dataIdMapping[serverNodeId] !== "undefined")
                                return;

                            /*
                             Check if entity already exists. If so, skip adding.
                             */
                            let BreakException = {};
                            try {
                                entityClass.getDataList().forEach((d:BasicEntity) => {
                                    if (d.getId() === serverNodeId) {
                                        console.log("ENTITY ", d.getId(), "already exists");
                                        throw BreakException;
                                    }
                                });

                            } catch (e) {
                                if (e !== BreakException)
                                    throw e;
                                return;
                            }

                            dataIdMapping[serverNodeId] = new entityClass(serverNodeId, serverNode["properties"]);

                            // To distinguish between same data types from different calls later
                            (<BasicEntity>dataIdMapping[serverNodeId]).setData("is_init_data", true);
                        });
                        break;
                }
            }
        }

        if (typeof res["data"]["relations"] !== "undefined") {
            for (let rTypeK in res["data"]["relations"]) {
                let entityClass = this.dataMapping[rTypeK];

                if (!entityClass) {
                    console.warn("No dataentity class for type '" + rTypeK + "' found. Skipping");
                    continue;
                }

                let serverRelationList = res["data"]["relations"][rTypeK];
                serverRelationList.forEach((serverRelation) => {

                    let e1 = dataIdMapping[serverRelation["start"]];
                    let e2 = dataIdMapping[serverRelation["end"]];

                    // Nodes not in internal list, since they were already existing-
                    // Search them in the existing entities
                    if (!e1 || !e2) {

                        let BreakException = {};
                        try {
                            BasicEntity.getDataList().forEach((existingDE:BasicEntity) => {

                                if (e1 && e2)
                                    throw BreakException;

                                if (!e1 && existingDE.getId() === serverRelation["start"]) {
                                    e1 = existingDE;
                                    return;
                                }
                                if (!e2 && existingDE.getId() === serverRelation["end"]) {
                                    e2 = existingDE;
                                    return;
                                }
                            })
                        } catch (exc) {
                            if (exc !== BreakException)
                                throw exc;
                        }

                    }

                    /*
                     If still no connection, skip (could be...)
                     */
                    if (!e1 || !e2)
                        return;

                    switch (entityClass) {

                        case  ResourceTagConnection:

                            if (ResourceTagConnection.getObject(serverRelation["id"]))
                                break;

                            let connectionRT = new ResourceTagConnection(
                                serverRelation["id"],
                                <AfelResourceDataEntity>e1,
                                <AfelTagDataEntity>e2,
                                serverRelation["properties"]
                            );
                            (<AfelResourceDataEntity>e1).addConnection(connectionRT);
                            (<AfelTagDataEntity>e2).addConnection(connectionRT);
                            dataIdMapping[serverRelation["id"]] = connectionRT;
                            break;

                        case  LearningActivity:

                            if (LearningActivity.getObject(serverRelation["id"]))
                                break;

                            let connectionLA = new LearningActivity(
                                serverRelation["id"],
                                <AfelLearnerDataEntity>e1,
                                <AfelResourceDataEntity>e2,
                                serverRelation["properties"]
                            );
                            ( <AfelLearnerDataEntity>e1).addConnection(connectionLA);
                            (<AfelResourceDataEntity>e2).addConnection(connectionLA);
                            dataIdMapping[serverRelation["id"]] = connectionLA;
                            break;

                        case  ResourceResourceTransitionConnectionOfUserVisited:

                            if (ResourceResourceTransitionConnectionOfUserVisited.getObject(serverRelation["id"]))
                                break;

                            let connectionRRU = new ResourceResourceTransitionConnectionOfUserVisited(
                                serverRelation["id"],
                                <AfelResourceDataEntity>e1,
                                <AfelResourceDataEntity>e2,
                                serverRelation["properties"]
                            );
                            (<AfelResourceDataEntity>e1).addConnection(connectionRRU);
                            (<AfelResourceDataEntity>e2).addConnection(connectionRRU);
                            dataIdMapping[serverRelation["id"]] = connectionRRU;
                            break;

                        case  ResourceResourceTransitionConnectionGeneral:

                            if (ResourceResourceTransitionConnectionGeneral.getObject(serverRelation["id"]))
                                break;

                            let connectionRRG = new ResourceResourceTransitionConnectionGeneral(
                                serverRelation["id"],
                                <AfelResourceDataEntity>e1,
                                <AfelResourceDataEntity>e2,
                                serverRelation["properties"]
                            );
                            (<AfelResourceDataEntity>e1).addConnection(connectionRRG);
                            (<AfelResourceDataEntity>e2).addConnection(connectionRRG);
                            dataIdMapping[serverRelation["id"]] = connectionRRG;
                            break;

                        case  DynActionResConnection:

                            if (DynActionResConnection.getObject(serverRelation["id"]))
                                break;
                            let connectionDR = new DynActionResConnection(
                                serverRelation["id"],
                                <AfelDynActionDataEntity>e1,
                                <AfelResourceDataEntity>e2,
                                serverRelation["properties"]
                            );
                            (<AfelDynActionDataEntity>e1).addConnection(connectionDR);
                            (<AfelResourceDataEntity>e2).addConnection(connectionDR);
                            dataIdMapping[serverRelation["id"]] = connectionDR;
                            break;

                        case  DynActionDynActionConnection:

                            if (DynActionDynActionConnection.getObject(serverRelation["id"]))
                                break;
                            let connectionDD = new DynActionDynActionConnection(
                                serverRelation["id"],
                                <AfelDynActionDataEntity>e1,
                                <AfelDynActionDataEntity>e2,
                                serverRelation["properties"]
                            );
                            (<AfelDynActionDataEntity>e1).addConnection(connectionDD);
                            (<AfelDynActionDataEntity>e2).addConnection(connectionDD);
                            dataIdMapping[serverRelation["id"]] = connectionDD;
                            break;

                        default:
                            console.warn("Could not handle connection-Entity-Class", entityClass);
                    }
                });
            }
        }

        // dataIdMapping = this.createDynActionDynActionConnections(dynDataForPostProcess, dataIdMapping);

        return dataIdMapping;
    }

    /**
     * Obsolete: Calculated on server now.
     */
    /*
    private sortDynDatasByDateFct(d1:AfelDynActionDataEntity, d2:AfelDynActionDataEntity) {
        let date1 = new Date(<string>d1.getData("action_date"));
        let date2 = new Date(<string>d2.getData("action_date"));
        return date1 < date2 ? -1 : (date2 < date1 ? 1 : 0);
    }

    private createDynActionDynActionConnections(data:AfelDynActionDataEntity[], dataIdMapping) {
        data.sort(this.sortDynDatasByDateFct);


        data.forEach((d1:AfelDynActionDataEntity, k) => {
            if (k === 0)
                return;
            let d2:AfelDynActionDataEntity = data[k - 1];
            let newConnectionId = d1.getId() + "-" + d2.getId();
            let connectionDD = new DynActionDynActionConnection(
                newConnectionId,
                d1,
                d2,
                {
                    "startdate": d1.getData("action_date"),
                    "enddate": d2.getData("action_date")
                }
            );
            d1.addConnection(connectionDD);
            d2.addConnection(connectionDD);
            dataIdMapping[newConnectionId] = connectionDD;

            console.log(d1.getId(), d2.getId());
        });

        return dataIdMapping;
    }
    */

    public setData(data) {


    }


    public getLoadedData() {
        return null;
    }
}