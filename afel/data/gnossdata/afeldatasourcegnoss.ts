import {AfelDataSourceInterace} from "../datasource_interface";
import {DataService} from "../../../gvfcore/services/data.service";
import {AfelResourceDataEntity} from "../../graph/data/resource";
import {AfelLearnerDataEntity} from "../../graph/data/learner";
import {LearningActivity} from "../../graph/data/connections/learningactivity";
import {AfelTagDataEntity} from "../../graph/data/tag";
import {ResourceTagConnection} from "../../graph/data/connections/resourcetag";
import {BasicEntity} from "../../../gvfcore/components/graphvis/data/databasicentity";
import raw = require("core-js/fn/string/raw");


export class AfelDataSourceGnoss implements AfelDataSourceInterace {


    private http;
    private url = "http://localhost:8082";
    private urlPaths = {
        init: "/",
        resource: "/resource",
        user: "/user",
        tag: "/tag"
    };


    private dataMapping = {
        "User": AfelLearnerDataEntity,
        "Resource": AfelResourceDataEntity,
        "Tag": AfelTagDataEntity,
        "HAS_TAG": ResourceTagConnection,
        "USER_RESOURCE_ACTION": LearningActivity
    };


    constructor(private dataContainer) {
        this.http = DataService.getInstance().getHttp();

    }

    public fetchInitDataFromServer(cb = null) {

        let postData = {
            method: "getInitGraph",
            data: {
                userId: 1,
                count: 500
            }
        };
            this.makeCall(this.url + this.urlPaths.init, postData, cb);
    }


    public loadUsersOfResource(resourceId, cb) {
        let postData = {
            method: "getUsers",
            data: {
                resourceId: resourceId,
                count: 500
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

    public loadResourcesConnections(newResourceIds, cb) {
        let postData = {
            method: "getResourcesConnections",
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

                        default:
                            console.warn("Could not handle connection-Entity-Class", entityClass);

                    }

                });
            }
        }

        return dataIdMapping;
    }

    public setData(data) {


    }


    public getLoadedData() {
        return null;
    }
}