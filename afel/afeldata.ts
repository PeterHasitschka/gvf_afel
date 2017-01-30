import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise'
import {Learner} from "./graph/data/learner";
import {Resource} from "./graph/data/resource";
import {Activity} from "./graph/data/activity";
import {DataService} from "../gvfcore/services/data.service";
import {LearningActivity} from "./graph/data/learningactivity";
import {CommunicationActivity} from "./graph/data/communicationactivity";
import {Community} from "./graph/data/communities/community";
import {LearningCommunity} from "./graph/data/communities/learningCommunity";
import {CommunicationCommunity} from "./graph/data/communities/communicationCommunity";
import {NodeLearner} from "./graph/graphs/nodes/learner";
import {EdgeAbstract} from "../gvfcore/components/graphvis/graphs/edges/edgeelementabstract";
import {EdgeLearnersCommunicating} from "./graph/graphs/edges/learnercommunicating";
import {EdgeLearnersLearning} from "./graph/graphs/edges/learnerlearning";



declare var jLouvain:any;

/**
 * Service for loading resource, learner, and activity data.
 * Optional singleton concept => Usage in non-components (where injection does not work): AfelData.getInstance()
 * @author Peter Hasitschka
 */
export class AfelData {

    static instance:AfelData;
    static isCreating:Boolean = false;
    private http;
    private data;


    /**
     * If true, the server is used for retrieving data (also dummy data).
     * Else data is generated on the fly (e.g. for performance benchmarks)
     * @type {boolean}
     */
    static USE_SERVER_DATA = true;
    static DUMMYDATA = {
        learners: 'afel/data/frenchcourse/learners.json',
        resources: 'afel/data/frenchcourse/resources.json',
        activities: 'afel/data/frenchcourse/activities.json',
    };

    /**
     * Creating the singleton instance
     * @returns {AfelData}
     */
    constructor() {

        this.http = DataService.getInstance().getHttp();
        this.data = {
            learners: [],
            resources: [],
            activities: [],
            communities: {
                learning: [],
                communicating: []
            }
        };
        if (!AfelData.isCreating) {
            return AfelData.getInstance();
        }

    }

    /**
     * Getting the singleton instance of the AfelData
     * @returns {AfelData}
     */
    static getInstance() {
        if (AfelData.instance == null) {
            AfelData.isCreating = true;
            AfelData.instance = new AfelData();
            AfelData.isCreating = false;
        }
        return AfelData.instance;
    }

    /**
     * Fetching data.
     * @param cb {Function} Optional Callback when ready
     * @returns {null}
     */
    fetchData(cb?:Function) {
        var ret = null;
        if (AfelData.USE_SERVER_DATA)
            ret = this.fetchDataFromServer();
        else
            ret = this.fetchGeneratedDummyData().then(()=> {
                if (cb)
                    cb();
            });
        return ret;
    }

    /**
     * Generating and retrieving Dummy-Data
     * @returns {Promise<boolean>}
     */
    fetchGeneratedDummyData() {

        let USER_LENGTH = 500;
        let RESOURCE_LENGTH = 100;
        let ACTIVITY_LEARN_LENGTH = 100;
        let ACTIVITY_COMMUNICATE_LENGTH = 100;

        for (let i = 0; i < USER_LENGTH; i++) {
            let learnersData = {id: i, name: "Your mum"};
            this.data.learners.push(new Learner(learnersData.id, learnersData));
        }
        for (let i = 0; i < RESOURCE_LENGTH; i++) {
            let resourceData = {id: i, title: "Soemthing", compexity: Math.random()};
            this.data.resources.push(new Resource(resourceData.id, resourceData));
        }
        for (let i = 0; i < ACTIVITY_LEARN_LENGTH; i++) {
            let learner = Learner.getObject(Math.floor(Math.random() * USER_LENGTH));
            let resource = Resource.getObject(Math.floor(Math.random() * RESOURCE_LENGTH));
            this.data.activities.push(new LearningActivity(i, learner, resource, {}));
        }
        // for (let i = 0; i < ACTIVITY_COMMUNICATE_LENGTH; i++) {
        //     this.data.activities.push(new Activity({
        //         id: i, type: "communicating",
        //         learner1_id: Math.floor(Math.random() * USER_LENGTH),
        //         learner2_id: Math.floor(Math.random() * USER_LENGTH),
        //     }));
        // }
        return Promise.resolve(true);
    }

    /**
     * Fetching and returning learners, resources, and activities from the server.
     * Returned as Promise.
     * @returns {Promise<TResult>}
     */
    fetchDataFromServer() {
        console.log("Fetching learning-platform data from server...");
        return this.fetchLearners()
            .then(() => {
                return this.fetchResources().then(() => {
                    return this.fetchActivities().then(() => {
                        //return this.createDummyDemoCommunities();
                        //return this.extractCommunities();
                    })
                })
            })


    }


    /**
     * Creating learning- and communication communication communities.
     * Must be called after the learner graph was created and connected,
     * since the data-activities do not describe the connections between the nodes,
     * which are created in the learner graph.
     * @see{LearnerGraph.init()}
     * @param connectedLearnerGraphNodes
     */
    public extractCommunitiesFromExistingLearnerGraph(connectedLearnerGraphNodes:NodeLearner[]) {
        let louvainNodes = [];
        let louvainEdgesComm = [];
        let louvainEdgesLearn = [];
        connectedLearnerGraphNodes.forEach((ln:NodeLearner) => {
            louvainNodes.push(ln.getDataEntity().getId());

            ln.getEdges().forEach((e:EdgeAbstract) => {

                if (e.constructor === EdgeLearnersCommunicating) {
                    louvainEdgesComm.push({
                        source: e.getSourceNode().getDataEntity().getId(),
                        target: e.getDestNode().getDataEntity().getId(),
                        weight: 1.0
                    });
                } else if (e.constructor === EdgeLearnersLearning) {
                    louvainEdgesLearn.push({
                        source: e.getSourceNode().getDataEntity().getId(),
                        target: e.getDestNode().getDataEntity().getId(),
                        weight: 1.0
                    });
                }
            });
        });

        let createCommunities = function(nodes, edges, communityClass){
            let c = jLouvain().nodes(nodes).edges(edges);
            let communityMapping = c();

            let communityEntities = {};
            for (var lId in communityMapping) {
                let cId =communityMapping[lId];

                if (typeof communityEntities[cId] === "undefined")
                    communityEntities[cId] = [];
                let lEntity = Learner.getObject(parseInt(lId));
                communityEntities[cId].push(lEntity);
            }

            let communities=[];
            for (let cKey in communityEntities) {
                if (communityEntities[cKey].length < 3)
                    continue;
                let community = new communityClass(communityClass.getDataList().length, communityEntities[cKey], {});
                communities.push(community);
            }
            return communities;
        };

        let lcs = createCommunities(louvainNodes, louvainEdgesLearn, LearningCommunity);
        let ccs = createCommunities(louvainNodes, louvainEdgesComm, CommunicationCommunity);
        this.setLearningCommunities(lcs);
        this.setCommunicationCommunities(ccs);
    }



    createDummyDemoCommunities() {
        console.log("Creating Demo Groups out of data from server...");


        let alreadyChosenIds = [];
        let learnerFetcher = function (maxnum:number):Learner[] {
            let randomLearners:Learner[] = [];
            for (let i = 0; i < maxnum; i++) {
                let someLearnerId = Math.floor(Math.random() * Learner.getDataList().length);
                while (alreadyChosenIds.indexOf(someLearnerId) >= 0)
                    someLearnerId = Math.floor(Math.random() * Learner.getDataList().length);
                alreadyChosenIds.push(someLearnerId);
                let someRandomLearner = Learner.getObject(someLearnerId);
                randomLearners.push(someRandomLearner);
            }
            //console.log("Fetched learners: ", randomLearners);
            return randomLearners;
        };

        let c1 = new LearningCommunity(LearningCommunity.getDataList().length, learnerFetcher(10), {});
        let c2 = new LearningCommunity(LearningCommunity.getDataList().length, learnerFetcher(5), {});
        let c3 = new LearningCommunity(LearningCommunity.getDataList().length, learnerFetcher(20), {});


        this.data.communities.learning = [c1, c2, c3];

        return true;
    }

    /**
     * Fetching the learners from server, returning as promise
     * @returns {Promise<TResult>}
     */
    fetchLearners() {
        console.log("Fetching learners data from server...");
        return this.http.get(AfelData.DUMMYDATA.learners)
            .map(res => res.json())
            .toPromise()
            .then((r) => {
                r.forEach((resultdata) => {
                    let learner = new Learner(resultdata["id"], resultdata);
                    this.data.learners.push(learner);
                });
                //console.log("Fetched Learners:", this.data.learners);
            });
    }

    /**
     * Fetching the resources from server, returning as promise
     * @returns {Promise<TResult>}
     */
    fetchResources() {
        console.log("Fetching resource data from server...");
        return this.http.get(AfelData.DUMMYDATA.resources)
            .map(res => res.json())
            .toPromise()
            .then((r) => {
                r.forEach((resultdata) => {
                    let resource = new Resource(resultdata["id"], resultdata);
                    this.data.resources.push(resource);
                });
                //console.log("Fetched Resources:", this.data.resources);
            });
    }

    /**
     * Fetching the activities from server, returning as promise
     * @returns {Promise<TResult>}
     */
    fetchActivities() {
        console.log("Fetching activities data from server...");
        return this.http.get(AfelData.DUMMYDATA.activities)
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
                    this.data.activities.push(act);
                });
                //console.log("Fetched Activties:", this.data.activities);
            });
    }

    /**
     * Return the (stored) learners
     * @returns {Array}
     */
    getLearners():Learner[] {
        return this.data.learners;
    }

    /**
     * Return the (stored) resources
     * @returns {Array}
     */
    getResources():Resource[] {
        return this.data.resources;
    }

    /**
     * Return the (stored) activities
     * @returns {Array}
     */
    getActivities():Activity[] {
        return this.data.activities;
    }

    /**
     * Return the (stored) learning communities
     * @returns {Array}
     */
    getLearningCommunities():LearningCommunity[] {
        return this.data.communities.learning;
    }

    setLearningCommunities(lcs:LearningCommunity[]) {
        this.data.communities.learning = lcs;
    }

    getCommunicationCommunities():CommunicationCommunity[] {
        return this.data.communities.communicating;
    }

    setCommunicationCommunities(ccs:CommunicationCommunity[]) {
        this.data.communities.communicating = ccs;
    }
}