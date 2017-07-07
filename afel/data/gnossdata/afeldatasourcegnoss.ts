import {AfelDataSourceInterace} from "../datasource_interface";
import {DataService} from "../../../gvfcore/services/data.service";
import {AfelResourceDataEntity} from "../../graph/data/resource";
import {AfelLearnerDataEntity} from "../../graph/data/learner";
import {LearningActivity} from "../../graph/data/connections/learningactivity";
import {AfelTagDataEntity} from "../../graph/data/tag";
import {ResourceTagConnection} from "../../graph/data/connections/resourcetag";
export class AfelDataSourceGnoss implements AfelDataSourceInterace {


    private http;
    private url = "http://localhost:8082";

    constructor(private dataContainer) {
        this.http = DataService.getInstance().getHttp();

    }

    public fetchDataFromServer(cb = null) {

        this.http.get(this.url)
            .map(res => res)
            .toPromise()
            .then((res) => {

            }, (r) => {
                alert("Error");
            });
    }


    public setData(data) {


    }


    public getLoadedData() {
        return null;
    }
}