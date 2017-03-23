import {GvfPluginInterface} from "../plugins/plugininterface";
import {GraphVisConfig} from "../gvfcore/components/graphvis/config";
import {ResourceGraph} from "./graph/graphs/resourcegraph";
import {LearnerGraph} from "./graph/graphs/learnergraph";
import {AfelData} from "./afeldata";
import {PluginApi} from "../gvfcore/api/gvfpluginapi";
import {INTERGRAPH_EVENTS} from "../gvfcore/services/intergraphevents.service";
import {LearningCommunityGraph} from "./graph/graphs/learningcommunitygraph";
import {CommunicationCommunityGraph} from "./graph/graphs/communicationcommunitygraph";
import {UiService} from "../gvfcore/services/ui.service";
import {SideInfoPositions, SideInfoContentType, SideInfoModel} from "../gvfcore/components/app/sideinfo/sideinfomodel";
import {ResourceGraphBPProj} from "./graph/graphs/resourcegraph_bipartite";
import {LearnerGraphBPProj} from "./graph/graphs/learnergraph_bipartite";
import {Plane} from "../gvfcore/components/plane/plane";
import {CombinedCommunityGraph} from "./graph/graphs/combinedcommunitygraph";
import {GroupGraphAbstract} from "../gvfcore/components/graphvis/graphs/graphgroupabstract";


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
            resourcegraph_background: '#8888aa'
        }

    }

    private compareCommunityPlanes() {
        let planes = Plane.getPlanes();
        let p1 = planes[2];
        let p2 = planes[3];

        CombinedCommunityGraph.generateComparedGraph(
            <GroupGraphAbstract>p1.getGraph(),
            <GroupGraphAbstract>p2.getGraph()
        );
    }


    public runAfterInit() {

        window['compare'] = this.compareCommunityPlanes;

        let toleranceStr = '(tolerance: ' + Math.round((1 - GraphVisConfig["afel"].samelearning_tolerance) * 100) + '%)';

        AfelData.getInstance().fetchData().then(() => {
            PluginApi.addPlane('<i class="fa fa-book" aria-hidden="true"></i> <strong>Resource</strong> ' +
                'Graph - Connecting resources with same learners ' + toleranceStr, ResourceGraph);
            // GvfApi.addPlane('<i class="fa fa-book" aria-hidden="true"></i> <strong>Resource</strong> ' +
            //     'Graph - <strong>BIPARTITE PROJECTION</strong>', ResourceGraphBPProj);
            PluginApi.addPlane('<i class="fa fa-user" aria-hidden="true"></i> <strong>Learner</strong> ' +
                'Graph - Connecting learners who learn the same ' + toleranceStr, LearnerGraph);
            // GvfApi.addPlane('<i class="fa fa-book" aria-hidden="true"></i> <strong>Learner</strong> ' +
            //     'Graph - <strong>BIPARTITE PROJECTION</strong>', LearnerGraphBPProj);
            PluginApi.addPlane('<i class="fa fa-users" aria-hidden="true"></i> <strong>Learning</strong> Communities',
                LearningCommunityGraph);
            PluginApi.addPlane('<i class="fa fa-users" aria-hidden="true"></i> <strong>Communication</strong> Communities',
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
            'Experimental',
            SideInfoPositions.Left,
            SideInfoContentType.Text,
            {
                text: 'Compare Commmunities: Call "window.compare()" on gvf.html'
            }
            )
        );


    }


}