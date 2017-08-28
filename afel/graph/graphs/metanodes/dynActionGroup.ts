import {Plane} from "../../../../gvfcore/components/plane/plane";
import {MetanodeExpandable} from "../../../../gvfcore/components/graphvis/graphs/metanodes/metanodeexpandable";
import {NodeDynAction} from "../nodes/dynaction";
import {GraphVisConfig} from "../../../../gvfcore/components/graphvis/config";
import {GRAPH_ELEMENT_LABEL_TYPE} from "../../../../gvfcore/components/graphvis/graphs/graphelementabstract";
export class AfelMetanodeDynActions extends MetanodeExpandable {

    constructor(x:number, y:number, nodes:NodeDynAction[], plane:Plane, size = null) {
        let options = {
            size: size,
            segments: 8
        };
        super(x, y, nodes, plane, options);

        this.color = GraphVisConfig.graphelements['dynactionmetanode'].color;
        this.setColor(this.color);
        this.name = "DynamicAction Meta node";


        this.hoverText = "Group of " + this.nodes.length + " dynamic actions";
        this.hoverTextColor = "#224400";
        this.hovertextCenterX = true;

        this.exclusiveOpening = true;

        // this.labelType = GRAPH_ELEMENT_LABEL_TYPE.ICON;
        // this.labelIconSize = size * 0.6;
        // this.labelIconPath = "afel/assets/icon-resmetanode.png";
        // this.labelZoomLevelMin = 0.5;
        this.labelZoomAdjustmentBlocked = true;
    }


}
