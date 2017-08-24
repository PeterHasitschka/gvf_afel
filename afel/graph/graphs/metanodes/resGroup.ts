import {Plane} from "../../../../gvfcore/components/plane/plane";
import {NodeResource} from "../nodes/resource";
import {MetanodeExpandable} from "../../../../gvfcore/components/graphvis/graphs/metanodes/metanodeexpandable";
import {GraphVisConfig} from "../../../../gvfcore/components/graphvis/config";
import {GRAPH_ELEMENT_LABEL_TYPE} from "../../../../gvfcore/components/graphvis/graphs/graphelementabstract";
export class AfelMetanodeResources extends MetanodeExpandable {

    constructor(x:number, y:number, nodes:NodeResource[], plane:Plane, size = null) {
        let options = {
            size: size,
            segments: 4
        };
        super(x, y, nodes, plane, options);

        this.color = GraphVisConfig.graphelements['resmetanode'].color;
        this.setColor(this.color);
        this.name = "Resource Meta node";


        this.hoverText = "Cluster of " + this.nodes.length + " resources";
        this.hoverTextColor = "#0000FF";
        this.hovertextCenterX = false;


        this.labelType = GRAPH_ELEMENT_LABEL_TYPE.ICON;
        this.labelIconSize = size * 0.6;
        this.labelIconPath = "afel/assets/icon-resmetanode.png";
        this.labelZoomLevelMin = 0.5;

        this.labelZoomAdjustmentBlocked = true;
    }
}
