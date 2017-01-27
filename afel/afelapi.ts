import {GvfPluginInterface} from "../plugins/plugininterface";
import {GraphVisConfig} from "../gvfcore/components/graphvis/config";
import {ResourceGraph} from "./graph/graphs/resourcegraph";
import {LearnerGraph} from "./graph/graphs/learnergraph";
import {AfelData} from "./afeldata";
import {GvfApi} from "../gvfcore/api/gvfapi";
import {INTERGRAPH_EVENTS} from "../gvfcore/services/intergraphevents.service";
import {LearningCommunityGraph} from "./graph/graphs/learningcommunitygraph";
import {CommunicationCommunityGraph} from "./graph/graphs/communicationcommunitygraph";


export class AfelApi implements GvfPluginInterface {
    constructor() {
        console.log("AFEL API created")

        GraphVisConfig.graphelements['resourcenode'] = {
            color: 0xffffcc
        };
        GraphVisConfig.graphelements['learnernode'] = {
            color: 0x008800
        };

        GraphVisConfig.graphelements['learningcommunity'] = {
            segments: 128,
            size: 50,
            color: 0x3333aa,
            highlight_color: 0xff3333,
            z_pos: 0.0
        };
        GraphVisConfig.graphelements['communicationcommunity'] = {
            segments: 128,
            size: 50,
            color: 0x33aa33,
            highlight_color: 0xff3333,
            z_pos: 0.0
        };

        GraphVisConfig.active_graphs['resource'] = ResourceGraph;
        GraphVisConfig.active_graphs['learner'] = LearnerGraph;
        GraphVisConfig.active_graphs['learningcommunity'] = LearningCommunityGraph;
        GraphVisConfig.active_graphs['communicationcommunity'] = CommunicationCommunityGraph;


        GraphVisConfig["afel"] = {
            samelearning_tolerance: 0.95,
            resourcegraph_background : 0x8888aa
        }


    }


    public runAfterInit() {

        AfelData.getInstance().fetchData().then(() => {
            console.log("Creating two AFEL planes");
            GvfApi.addPlane("Resource Graph - Connecting resources with same learners (tolerance: " +
                Math.round((1 - GraphVisConfig["afel"].samelearning_tolerance) * 100) + "%)", "resource");
            GvfApi.addPlane("Learner Graph - Connecting learners who learn the same (tolerance: " +
                Math.round((1 - GraphVisConfig["afel"].samelearning_tolerance) * 100) + "%)", "learner");

            GvfApi.addPlane("Learning Communities", "learningcommunity");
            GvfApi.addPlane("Communication Communities", "communicationcommunity");
        });

    }


}