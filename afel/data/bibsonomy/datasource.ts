import {AfelDataSourceInterace} from "../datasource_interface";
import {UiService} from "../../../gvfcore/services/ui.service";
import {DataService} from "../../../gvfcore/services/data.service";
import {Learner} from "../../graph/data/learner";
import {Resource} from "../../graph/data/resource";
import {Activity} from "../../graph/data/activity";
import {LearningActivity} from "../../graph/data/learningactivity";
import {CommunicationActivity} from "../../graph/data/communicationactivity";
export class AfelDataSourceBibsonomy implements AfelDataSourceInterace {

    private http =  DataService.getInstance().getHttp();
    private file = 'afel/data/bibsonomy/bib_pubs_2_perc.json';


    constructor(private dataContainer){
    }

    /**
     * Fetching and returning learners, resources, and activities from the server.
     * Returned as Promise.
     * @returns {Promise<TResult>}
     */
    fetchDataFromServer() {

        UiService.consolelog("Fetching learning-platform data from server...", this, null, 5);

        return this.http.get(this.file)
            .map(res => res.json())
            .toPromise()
            .then((r) => {

                let lIds = [];
                let rIds = [];

                r.forEach((row) => {

                    if (lIds.indexOf(row["timestamp"]) === -1)
                        lIds.push(row["timestamp"]);

                    // let learner = new Learner(resultdata["id"], resultdata);
                    // this.dataContainer.learners.push(learner);

                });
                //console.log("Fetched Learners:", this.data.learners);
                console.log(lIds, rIds);
            });
    }

}