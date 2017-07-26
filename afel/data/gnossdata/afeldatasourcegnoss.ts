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

    public fetchDataFromServer(cb = null) {

        let postData = {
            method: "getInitGraph",
            data: {
                userId: 18
            }
        };


        this.http.post(this.url, postData)
            .map(res => res.json())
            .toPromise()
            .then((res) => {

                console.log(res);
                this.storeResponseData(res);

                console.log(AfelResourceDataEntity.getDataList());
                console.log(AfelLearnerDataEntity.getDataList());
                console.log(AfelTagDataEntity.getDataList());
                if (cb)
                    cb();

            }, (r) => {
                alert("Error");
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


                    switch (entityClass) {

                        case  ResourceTagConnection:
                            let connection = new ResourceTagConnection(
                                serverRelation["id"],
                                <AfelResourceDataEntity>e1,
                                <AfelTagDataEntity>e2,
                                serverRelation["properties"]
                            );
                            (<AfelResourceDataEntity>e1).addConnection(connection);
                            (<AfelTagDataEntity>e2).addConnection(connection);
                            dataIdMapping[serverRelation["id"]] = connection;
                            break;

                        case  LearningActivity:
                            let connection = new LearningActivity(
                                serverRelation["id"],
                                <AfelLearnerDataEntity>e1,
                                <AfelResourceDataEntity>e2,
                                serverRelation["properties"]
                            );
                            ( <AfelLearnerDataEntity>e1).addConnection(connection);
                            (<AfelResourceDataEntity>e2).addConnection(connection);
                            dataIdMapping[serverRelation["id"]] = connection;
                            break;

                        case  ResourceTagConnection:
                            let connection = new ResourceTagConnection(
                                serverRelation["id"],
                                <AfelResourceDataEntity>e1,
                                <AfelTagDataEntity>e2,
                                serverRelation["properties"]
                            );
                            ( <AfelResourceDataEntity>e1).addConnection(connection);
                            (<AfelTagDataEntity>e2).addConnection(connection);
                            dataIdMapping[serverRelation["id"]] = connection;
                            break;
                    }

                });
            }
        }
    }

    public setData(data) {


    }


    public getLoadedData() {
        return null;
    }
}