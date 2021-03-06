import {GvfPluginInterface} from "../plugins/plugininterface";
import {GraphVisConfig} from "../gvfcore/components/graphvis/config";
import {UiService} from "../gvfcore/services/ui.service";
import {SideInfoPositions, SideInfoContentType, SideInfoModel} from "../gvfcore/components/app/sideinfo/sideinfomodel";
import {Plane} from "../gvfcore/components/plane/plane";
import {GroupGraphAbstract} from "../gvfcore/components/graphvis/graphs/graphgroupabstract";
import {AfelDataService} from "./data/afeldata.service";
import {PluginApi} from "../gvfcore/api/gvfpluginapi";
import {AfelAutoCompleteGraph} from "./graph/graphs/afelautocomplete";
import {CombinedCommunityGraph} from "./graph/graphs/combinedcommunitygraph";
import {AfelAutoResourceGraph} from "./graph/graphs/afelautoresources";
import {AfelAutoLearnersGraph} from "./graph/graphs/afelautolearners";
import {AfelAutoTagsGraph} from "./graph/graphs/afelautotags";
import {AfelResourceDataEntity} from "./graph/data/resource";
import {AfelAutoResourceTransitionNetworkGraph} from "./graph/graphs/afelautoresourcetransitionnetwork";
import {AfelDataSourceGnoss} from "./data/gnossdata/afeldatasourcegnoss";


export class AfelApi implements GvfPluginInterface {
    constructor() {
        UiService.consolelog("Created AFEL API Plugin", this, null, 4);
        GraphVisConfig.environment.title = "GVF - GNOSS data";
        GraphVisConfig.environment.showleftcol = false;

        GraphVisConfig.graphelements['resourcenode'] = {
            color: 0x8888ff
        };
        GraphVisConfig.graphelements['learnernode'] = {
            color: 0x27A027
        };
        GraphVisConfig.graphelements['tagnode'] = {
            color: 0xCE6B89
        };
        GraphVisConfig.graphelements['dynactionnode'] = {
            color: 0xc6c42f,
            z: 0
        };
        GraphVisConfig.graphelements['resmetanode'] = {
            color: 0x8888ff
        };
        GraphVisConfig.graphelements['dynactionmetanode'] = {
            color: 0xefc700,
            topColor: 0xceb956,
            z: -1
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
            resourcegraph_background: '#ffffff'
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

        (<AfelDataSourceGnoss>AfelDataService.getInstance().getDataSource()).fetchInitDataFromServer(function (someBool, data) {


            PluginApi.addPlane('<i class="fa fa-book" aria-hidden="true"></i> <strong>Timeline</strong> ' +
                'Graph (For current user)', AfelAutoCompleteGraph, true);


            // (<AfelDataSourceGnoss>AfelDataService.getInstance().getDataSource()).fetchGlobalResourceTransitionNetwork(function (someBool, data) {
            //     PluginApi.addPlane('<i class="fa fa-book" aria-hidden="true"></i> Global Resource Transition Graph', AfelAutoResourceTransitionNetworkGraph, false);
            // });


            // Old, single graphs

            //
            // PluginApi.addPlane('<i class="fa fa-book" aria-hidden="true"></i> <strong>Resources</strong> ' +
            //     'Graph', AfelAutoResourceGraph, false);
            //
            // PluginApi.addPlane('<i class="fa fa-book" aria-hidden="true"></i> <strong>Learners</strong> ' +
            //     'Graph', AfelAutoLearnersGraph, false);
            //
            // PluginApi.addPlane('<i class="fa fa-book" aria-hidden="true"></i> <strong>Tags</strong> ' +
            //     'Graph', AfelAutoTagsGraph, false);


        }.bind(this));


        UiService.getInstance().addSideInfoElement(new SideInfoModel(
            '<i class="fa fa-info-circle" aria-hidden="true"></i> AFEL',
            SideInfoPositions.Left,
            SideInfoContentType.Text,
            {
                text: 'Demo Application with GVF included as IFrame. ' +
                'The data here is <a href="http://afel-project.eu/" target="_blank">AFEL</a> specific.<br>'
            }
            )
        );


        UiService.getInstance().addSideInfoElement(new SideInfoModel(
            '<i class="fa fa-info-circle" aria-hidden="true"></i> Legend',
            SideInfoPositions.Right,
            SideInfoContentType.Text,
            {
                text: "<div class='afel-legend-line'><div class='afel-legend-node afel-legend-learnernode'></div><span>Learner</span></div>" +
                "<div class='afel-legend-line'><div class='afel-legend-node afel-legend-resourcenode'></div><span>Resource</span></div>" +
                "<div class='afel-legend-line'><div class='afel-legend-node afel-legend-tagnode'></div><span>Tag (Keyword)</span></div>" +
                "<div class='afel-legend-line'><div class='afel-legend-path afel-legend-learningpath'></div><span>Learning-Path</span></div>"
            },
            1
            )
        )
        ;


    }


}