import {GvfPluginInterface} from "../plugins/plugininterface";
import {GraphVisConfig} from "../gvfcore/components/graphvis/config";
import {ResourceGraph} from "./graph/graphs/resourcegraph";
import {LearnerGraph} from "./graph/graphs/learnergraph";
import {AfelData} from "./afeldata";
import {GvfApi} from "../gvfcore/api/gvfapi";
import {INTERGRAPH_EVENTS} from "../gvfcore/services/intergraphevents.service";
import {LearningCommunityGraph} from "./graph/graphs/learningcommunitygraph";
import {CommunicationCommunityGraph} from "./graph/graphs/communicationcommunitygraph";
import {UiService} from "../gvfcore/services/ui.service";
import {SideInfoPositions, SideInfoContentType, SideInfoModel} from "../gvfcore/components/app/sideinfo/sideinfomodel";
import {ResourceGraphBPProj} from "./graph/graphs/resourcegraph_bipartite";


export class AfelApi implements GvfPluginInterface {
    constructor() {
        UiService.consolelog("Created AFEL API Plugin", this, null, 4);
        GraphVisConfig.graphelements['resourcenode'] = {
            color: 0xffffcc,
            highlightcolor: 0xff4422
        };
        GraphVisConfig.graphelements['learnernode'] = {
            color: 0x008800
        };

        GraphVisConfig.graphelements['learningcommunity'] = {
            segments: 128,
            size: 50,
            color: 0x3333aa,
            highlight_color: 0xFF5555,
            z_pos: 0.0
        };
        GraphVisConfig.graphelements['communicationcommunity'] = {
            segments: 128,
            size: 50,
            color: 0x33aa33,
            highlight_color: 0xFF5555,
            z_pos: 0.0
        };

        GraphVisConfig["afel"] = {
            samelearning_tolerance: 0.95,
            resourcegraph_background: 0x8888aa
        }

    }


    public runAfterInit() {

        let toleranceStr = '(tolerance: ' + Math.round((1 - GraphVisConfig["afel"].samelearning_tolerance) * 100) + '%)';

        AfelData.getInstance().fetchData().then(() => {
            // GvfApi.addPlane('<i class="fa fa-book" aria-hidden="true"></i> <strong>Resource</strong> ' +
            //     'Graph - Connecting resources with same learners ' + toleranceStr, ResourceGraph);
            GvfApi.addPlane('<i class="fa fa-book" aria-hidden="true"></i> <strong>Resource</strong> ' +
                'Graph - <strong>BIPARTITE PROJECTION</strong>', ResourceGraphBPProj);
            GvfApi.addPlane('<i class="fa fa-user" aria-hidden="true"></i> <strong>Learner</strong> ' +
                'Graph - Connecting learners who learn the same ' + toleranceStr, LearnerGraph);

            GvfApi.addPlane('<i class="fa fa-users" aria-hidden="true"></i> <strong>Learning</strong> Communities',
                LearningCommunityGraph);
            GvfApi.addPlane('<i class="fa fa-users" aria-hidden="true"></i> <strong>Communication</strong> Communities',
                CommunicationCommunityGraph);



        });


        UiService.getInstance().addSideInfoElement(new SideInfoModel(
            '<i class="fa fa-info-circle" aria-hidden="true"></i> AFEL',
            SideInfoPositions.Left,
            SideInfoContentType.Text,
            {
                text: 'Demo Application with GVF included as IFrame. ' +
                'The data here is <a href="http://afel-project.eu/" target="_blank">AFEL</a> specific.<br>' +
                'More Details about this visualization can be found <a href="https://github.com/PeterHasitschka/gvf_afel" target="_blank">here</a>.'
            }
            )
        );


        UiService.getInstance().addSideInfoElement(new SideInfoModel(
            'ATTENTION!',
            SideInfoPositions.Right,
            SideInfoContentType.Text,
            {
                text: '<div class="alert alert-danger">' +
                '<strong>BIPARTITE PROJECTION branch</strong>' +
                '</div>'
            }
            )
        );

    }


}