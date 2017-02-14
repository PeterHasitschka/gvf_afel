import {AfelDataSourceInterace} from "../datasource_interface";
import {UiService} from "../../../gvfcore/services/ui.service";
import {DataService} from "../../../gvfcore/services/data.service";
import {Learner} from "../../graph/data/learner";
import {Resource} from "../../graph/data/resource";
import {Activity} from "../../graph/data/activity";
import {LearningActivity} from "../../graph/data/learningactivity";
import {CommunicationActivity} from "../../graph/data/communicationactivity";
export class AfelDataSourceFrenchCourse implements AfelDataSourceInterace {

    private http =  DataService.getInstance().getHttp();
    private files = {
        learners: 'afel/data/frenchcourse/learners.json',
        resources: 'afel/data/frenchcourse/resources.json',
        activities: 'afel/data/frenchcourse/activities.json',
    };

    constructor(private dataContainer){
    }

    /**
     * Fetching and returning learners, resources, and activities from the server.
     * Returned as Promise.
     * @returns {Promise<TResult>}
     */
    fetchDataFromServer() {

        UiService.consolelog("Fetching learning-platform data from server...", this, null, 5);
        return this.fetchLearners()
            .then(() => {
                return this.fetchResources().then(() => {
                    return this.fetchActivities().then(() => {
                    })
                })
            });
    }


    /**
     * Fetching the learners from server, returning as promise
     * @returns {Promise<TResult>}
     */
    fetchLearners() {
        UiService.consolelog("Fetching learners data from server...", this, null, 5);
        return this.http.get(this.files.learners)
            .map(res => res.json())
            .toPromise()
            .then((r) => {
                r.forEach((resultdata) => {
                    let learner = new Learner(resultdata["id"], resultdata);
                    this.dataContainer.learners.push(learner);
                });
                //console.log("Fetched Learners:", this.data.learners);
            });
    }

    /**
     * Fetching the resources from server, returning as promise
     * @returns {Promise<TResult>}
     */
    fetchResources() {
        UiService.consolelog("Fetching resource data from server...", this, null, 5);
        return this.http.get(this.files.resources)
            .map(res => res.json())
            .toPromise()
            .then((r) => {
                r.forEach((resultdata) => {
                    let resource = new Resource(resultdata["id"], resultdata);
                    this.dataContainer.resources.push(resource);
                });
                //console.log("Fetched Resources:", this.data.resources);
            });
    }

    /**
     * Fetching the activities from server, returning as promise
     * @returns {Promise<TResult>}
     */
    fetchActivities() {
        UiService.consolelog("Fetching activities data from server...", this, null, 5);
        return this.http.get(this.files.activities)
            .map(res => res.json())
            .toPromise()
            .then((r) => {
                r.forEach((resultdata) => {
                    let act:Activity = null;
                    switch (resultdata["type"]) {
                        case "learning" :

                            let resource = Resource.getObject(resultdata["resource_id"]);
                            let learner = Learner.getObject(resultdata["learner_id"]);
                            act = new LearningActivity(resultdata["id"],
                                learner,
                                resource,
                                resultdata);

                            resource.addLearningActivity(act);
                            learner.addLearningActivity(act);

                            break;
                        case "communicating" :
                            let learner1 = <Learner>Learner.getObject(resultdata["learner1_id"]);
                            let learner2 = <Learner>Learner.getObject(resultdata["learner2_id"]);
                            act = new CommunicationActivity(resultdata["id"],
                                learner1,
                                learner2,
                                resultdata);

                            learner1.addCommunicationActivity(act);
                            learner2.addCommunicationActivity(act);

                            break;
                    }
                    this.dataContainer.activities.push(act);
                });
                //console.log("Fetched Activties:", this.data.activities);
            });
    }
}