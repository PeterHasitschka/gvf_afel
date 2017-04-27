import {AfelDataSourceInterace} from "../datasource_interface";
import {DataService} from "../../../gvfcore/services/data.service";
import {AfelResourceDataEntity} from "../../graph/data/resource";
import {AfelLearnerDataEntity} from "../../graph/data/learner";
import {LearningActivity} from "../../graph/data/connections/learningactivity";
export class AfelDataSourceSolr implements AfelDataSourceInterace {


    private baseApiUrl = "http://kcs-afelwork.know.know-center.at:8985/solr/";
    private urlReviews = "reviews/";
    private urlResources = "resources/";
    private maxDate:Date;
    private rangeMs = 365 * 24 * 60 * 60 * 1000;
    private maxReviews = 100;
    private http;

    constructor(private dataContainer) {
        this.http = DataService.getInstance().getHttp();

        this.maxDate = new Date();


    }

    public fetchDataFromServer(cb = null) {
        let url = this.getApiUrlReviews();

        console.log(url);


        return this.http.get(url)
            .map(res => res.json())
            .toPromise()
            .then((r) => {
                if (cb)
                    cb(r.response.docs);
            });
    }


    public setData(data) {

        let resourceMapping = {};
        let learnerMapping = {};

        for (var i = 0; i < data.length; i++) {
            let visit = data[i];

            let resource:AfelResourceDataEntity;
            if (typeof resourceMapping[visit.resourceId] === "undefined") {
                resource = new AfelResourceDataEntity({hash: visit.resourceId});
                resourceMapping[visit.resourceId] = resource;
            }
            else {
                resource = resourceMapping[visit.resourceId];
            }

            let learner:AfelLearnerDataEntity;
            if (typeof learnerMapping[visit.user] === "undefined") {
                learner = new AfelLearnerDataEntity({hash: visit.user});
                learnerMapping[visit.user] = learner;
            }
            else {
                learner = learnerMapping[visit.user];
            }

            let learningActivity = new LearningActivity(learner, resource, visit);
            learner.addConnection(learningActivity);
            resource.addConnection(learningActivity);

        }

        console.log(AfelResourceDataEntity.getDataList());
        console.log(AfelLearnerDataEntity.getDataList());
    }


    public getLoadedData() {
        return null;
    }

    private getApiUrlReviews() {
        let url = this.baseApiUrl + this.urlReviews;
        let endDate:Date = this.maxDate;
        let beginDate:Date = new Date(endDate.valueOf() - this.rangeMs);
        let timeStr = this.convertDateToSolrDatestr(beginDate) + "%20TO%20" + this.convertDateToSolrDatestr(endDate);
        url += "select?indent=on&rows=" + this.maxReviews + "&q=time:[" + timeStr + "]&wt=json";
        return url;
    }

    private convertDateToSolrDatestr(date:Date):string {
        //date.setMonth(date.getMonth() - 1);
        return date.toISOString();
    }

}