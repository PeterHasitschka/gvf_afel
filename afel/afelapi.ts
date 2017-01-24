import {GvfPluginInterface} from "../plugins/plugininterface";
import {GraphVisConfig} from "../gvfcore/components/graphvis/config";
import {ResourceGraph} from "./graph/graphs/resourcegraph";
import {LearnerGraph} from "./graph/graphs/learnergraph";
import {AfelData} from "./afeldata";
import {GvfApi} from "../gvfcore/api/gvfapi";


export class AfelApi implements GvfPluginInterface {
    constructor() {
        console.log("AFEL API created")

        GraphVisConfig.nodes['resourcenode'] = {
            color: 0x5555bb
        }
        GraphVisConfig.nodes['learnernode'] = {
            color: 0x008800
        }


        GraphVisConfig.active_graphs['resource'] = ResourceGraph;
        GraphVisConfig.active_graphs['learner'] = LearnerGraph;


        GraphVisConfig["afel"] = {
            samelearning_tolerance : 0.9
        }

    }


    public runAfterInit() {

        console.log("AFEL API: Ready to do something funny");


        AfelData.getInstance().fetchData().then(() => {
            console.log("Creating two basic planes");
            GvfApi.addPlane("ResourceGraph", "resource");
            GvfApi.addPlane("Learner Graph", "learner");
        });

    }


}