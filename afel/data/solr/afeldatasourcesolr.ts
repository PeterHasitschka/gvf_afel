import {AfelDataSourceInterace} from "../datasource_interface";
import {DataService} from "../../../gvfcore/services/data.service";
export class AfelDataSourceSolr implements AfelDataSourceInterace {


    private baseApiUrl = "http://kcs-afelwork.know.know-center.at:8985/solr/";
    private urlReviews = "reviews/";
    private urlResources = "resources/";
    private maxDate:Date;
    private rangeMs = 365 * 24 * 60 * 60 * 1000;
    private maxReviews = 500;
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


    public getLoadedData() {
        return null;
    }

    public setData(data) {

        for (var i = 0; i < data.length; i++) {
            let visit = data[i];
            console.log(visit.resourceId, visit.user);
        }
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