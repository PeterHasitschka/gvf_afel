import {GvfPluginInterface} from "../plugins/plugininterface";
import {GraphVisConfig} from "../gvfcore/components/graphvis/config";
import {ResourceGraph} from "./graph/graphs/resourcegraph";
import {LearnerGraph} from "./graph/graphs/learnergraph";
import {AfelData} from "./afeldata";
import {GvfApi} from "../gvfcore/api/gvfapi";
import {INTERGRAPH_EVENTS} from "../gvfcore/services/intergraphevents.service";


export class AfelApi implements GvfPluginInterface {
    constructor() {
        console.log("AFEL API created")

        GraphVisConfig.graphelements['resourcenode'] = {
            color: 0x5555bb
        }
        GraphVisConfig.graphelements['learnernode'] = {
            color: 0x008800
        }


        GraphVisConfig.active_graphs['resource'] = ResourceGraph;
        GraphVisConfig.active_graphs['learner'] = LearnerGraph;


        GraphVisConfig["afel"] = {
            samelearning_tolerance: 0.95
        }


    }


    public runAfterInit() {

        AfelData.getInstance().fetchData().then(() => {
            console.log("Creating two AFEL planes");
            GvfApi.addPlane("Resource Graph - Connecting resources with same learners (tolerance: " +
                Math.round((1 - GraphVisConfig["afel"].samelearning_tolerance) * 100) + "%)", "resource");
            GvfApi.addPlane("Learner Graph - Connecting learners who learn the same (tolerance: " +
                Math.round((1 - GraphVisConfig["afel"].samelearning_tolerance) * 100) + "%)", "learner");
        });

    }


}