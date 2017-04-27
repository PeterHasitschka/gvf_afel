import {GvfPluginInterface} from "../plugins/plugininterface";
import {GraphVisConfig} from "../gvfcore/components/graphvis/config";
import {UiService} from "../gvfcore/services/ui.service";
import {SideInfoPositions, SideInfoContentType, SideInfoModel} from "../gvfcore/components/app/sideinfo/sideinfomodel";
import {Plane} from "../gvfcore/components/plane/plane";
import {CombinedCommunityGraph} from "./graph/graphs/combinedcommunitygraph";
import {GroupGraphAbstract} from "../gvfcore/components/graphvis/graphs/graphgroupabstract";
import {AfelDataService} from "./data/afeldata.service";


export class AfelApi implements GvfPluginInterface {
    constructor() {
        UiService.consolelog("Created AFEL API Plugin", this, null, 4);
        GraphVisConfig.environment.title = "GVF - Visualize Search Results (Solr data source)";
        GraphVisConfig.environment.showleftcol = false;

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

        AfelDataService.getInstance().getDataSource().fetchDataFromServer(function(data){
            AfelDataService.getInstance().getDataSource().setData(data);
            console.log("finished fetching data from afel data source");
        }.bind(this));


        // let toleranceStr = '(tolerance: ' + Math.round((1 - GraphVisConfig["afel"].samelearning_tolerance) * 100) + '%)';
        //
        // AfelData.getInstance().fetchData().then(() => {
        //     PluginApi.addPlane('<i class="fa fa-book" aria-hidden="true"></i> <strong>Resource</strong> ' +
        //         'Graph - Connecting resources with same learners ' + toleranceStr, ResourceGraph);
        //     // GvfApi.addPlane('<i class="fa fa-book" aria-hidden="true"></i> <strong>Resource</strong> ' +
        //     //     'Graph - <strong>BIPARTITE PROJECTION</strong>', ResourceGraphBPProj);
        //     PluginApi.addPlane('<i class="fa fa-user" aria-hidden="true"></i> <strong>Learner</strong> ' +
        //         'Graph - Connecting learners who learn the same ' + toleranceStr, LearnerGraph);
        //     // GvfApi.addPlane('<i class="fa fa-book" aria-hidden="true"></i> <strong>Learner</strong> ' +
        //     //     'Graph - <strong>BIPARTITE PROJECTION</strong>', LearnerGraphBPProj);
        //     PluginApi.addPlane('<i class="fa fa-users" aria-hidden="true"></i> <strong>Learning</strong> Communities',
        //         LearningCommunityGraph);
        //     PluginApi.addPlane('<i class="fa fa-users" aria-hidden="true"></i> <strong>Communication</strong> Communities',
        //         CommunicationCommunityGraph);
        // });


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


    }


}