import {AfelDataSourceInterace} from "../datasource_interface";
import {DataService} from "../../../gvfcore/services/data.service";
import {AfelResourceDataEntity} from "../../graph/data/resource";
import {AfelLearnerDataEntity} from "../../graph/data/learner";
import {LearningActivity} from "../../graph/data/connections/learningactivity";
import {AfelTagDataEntity} from "../../graph/data/tag";
import {ResourceTagConnection} from "../../graph/data/connections/resourcetag";
export class AfelDataSourceSolr implements AfelDataSourceInterace {


    private baseApiUrl = "http://kcs-afelwork.know.know-center.at:8985/solr/";
    private urlReviews = "reviews/";
    private urlResources = "resources/";
    private maxDate:Date;
    private rangeMs = 10 * 365 * 24 * 60 * 60 * 1000;
    private maxReviews = 200;
    private http;

    constructor(private dataContainer) {
        this.http = DataService.getInstance().getHttp();

        // this.maxDate = new Date(2016,1,1);
        this.maxDate = new Date();
    }

    public fetchInitDataFromServer(cb = null) {
        let reviewsUrl = this.getApiUrlReviews();

        console.log(reviewsUrl);


        this.http.get(reviewsUrl)
            .map(reviewsResult => reviewsResult.json())
            .toPromise()
            .then((reviewResult) => {


                // Fetch tags via a call for all resources-ids fetched before
                let rIds = [];
                reviewResult.response.docs.forEach((doc => {
                    let rId = doc.resourceId;
                    rIds.push(rId);
                }));
                let resourceUrl = this.getApiUrlResources(rIds);
                console.log(resourceUrl);

                return this.http.get(resourceUrl)
                    .map(resourceResults => resourceResults.json())
                    .toPromise()
                    .then((resourceResult) => {
                        this.enrichReviewDataWithResourceData(reviewResult, resourceResult);
                        if (cb)
                            cb(reviewResult.response.docs);
                    });
            }, (r) => {
                alert("Error calling SolR Server. Currently you need to have a Plugin installed " +
                    "which overrides the Allow-Control-Allow-Origin Header of the resonse. " +
                    "When using Chrome, search for the 'Allow-Control-Allow-Origin: *' extension");
            });
    }


    public setData(data) {

        let resourceMapping = {};
        let learnerMapping = {};
        let tagMapping = {};

        for (var i = 0; i < data.length; i++) {
            let visit = data[i];

            let resource:AfelResourceDataEntity;
            if (typeof resourceMapping[visit.resourceId] === "undefined") {

                if (typeof visit.resource === "undefined") {
                    console.warn("Could not find a loaded resource for that review!", visit);
                    continue;
                }

                resource = new AfelResourceDataEntity(null, {hash: visit.resourceId, type: visit.resource.type});
                resourceMapping[visit.resourceId] = resource;

                let tagStrings = visit.resource.Tag;
                tagStrings.forEach(tagString => {

                    let tag:AfelTagDataEntity;
                    if (typeof tagMapping[tagString] === "undefined") {
                        tag = new AfelTagDataEntity(null, tagString);
                        tagMapping[tagString] = tag;
                    } else
                        tag = tagMapping[tagString];

                    let tagConnection = new ResourceTagConnection(null, resource, tag, {});
                    resource.addConnection(tagConnection);
                    tag.addConnection(tagConnection);
                });

            }
            else {
                resource = resourceMapping[visit.resourceId];
            }

            let learner:AfelLearnerDataEntity;
            if (typeof learnerMapping[visit.user] === "undefined") {
                learner = new AfelLearnerDataEntity(null, {hash: visit.user});
                learnerMapping[visit.user] = learner;
            }
            else {
                learner = learnerMapping[visit.user];
            }

            let learningActivity = new LearningActivity(null, learner, resource, visit);
            learner.addConnection(learningActivity);
            resource.addConnection(learningActivity);

        }

        console.log(AfelResourceDataEntity.getDataList());
        console.log(AfelLearnerDataEntity.getDataList());
        console.log(AfelTagDataEntity.getDataList());
    }


    public getLoadedData() {
        return null;
    }


    private enrichReviewDataWithResourceData(reviewData, resourceData) {

        let resourceDataList = {};
        resourceData.response.docs.forEach(resource => {
            resourceDataList[resource.id] = resource;
        });

        reviewData.response.docs.forEach(review => {
            review['resource'] = resourceDataList[review.resourceId];
        });
    };

    private getApiUrlReviews() {
        let url = this.baseApiUrl + this.urlReviews;
        let endDate:Date = this.maxDate;
        let beginDate:Date = new Date(endDate.valueOf() - this.rangeMs);
        let timeStr = this.convertDateToSolrDatestr(beginDate) + "%20TO%20" + this.convertDateToSolrDatestr(endDate);
        url += "select?indent=on&rows=" + this.maxReviews + "&q=time:[" + timeStr + "]&wt=json";
        return url;
    }

    private getApiUrlResources(resourceIds) {
        let rIdEncapsulatedStrings = [];
        resourceIds.forEach((rId => {
            rIdEncapsulatedStrings.push("\"" + rId + "\"");
        }));

        // Make unique
        rIdEncapsulatedStrings = rIdEncapsulatedStrings.filter((v, i, a) => a.indexOf(v) === i);
        let rIdQueryStr = rIdEncapsulatedStrings.join("%20OR%20");

        let url = this.baseApiUrl + this.urlResources;
        url += 'select?indent=on&q=id:(' + rIdQueryStr + ')&rows=1000&wt=json';
        return url;
    }

    private convertDateToSolrDatestr(date:Date):string {
        //date.setMonth(date.getMonth() - 1);
        return date.toISOString();
    }
}