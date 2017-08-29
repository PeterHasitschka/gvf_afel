import {Plane} from "../../../../gvfcore/components/plane/plane";
import {MetanodeExpandable} from "../../../../gvfcore/components/graphvis/graphs/metanodes/metanodeexpandable";
import {NodeDynAction} from "../nodes/dynaction";
import {GraphVisConfig} from "../../../../gvfcore/components/graphvis/config";
import {GRAPH_ELEMENT_LABEL_TYPE} from "../../../../gvfcore/components/graphvis/graphs/graphelementabstract";
import {ShadowNodeSimple} from "../../../../gvfcore/components/graphvis/graphs/nodes/shadownodesimple";
import {NODEMESHCREATIONMODES} from "../../../../gvfcore/components/graphvis/graphs/nodes/nodeelementabstract";
export class AfelMetanodeDynActions extends MetanodeExpandable {

    constructor(x:number, y:number, nodes:NodeDynAction[], plane:Plane, size = null, othersSize = null) {
        let options = {
            size: size,
            segments: 8,
            nodemeshcreationmode: NODEMESHCREATIONMODES.DOUBLE_NODE,
            additionalmeshsize: othersSize,
            additionalmeshcolor: GraphVisConfig.graphelements['dynactionmetanode'].topColor
        };
        super(x, y, nodes, plane, options);

        this.color = GraphVisConfig.graphelements['dynactionmetanode'].color;
        this.setColor(this.color);
        this.name = "DynamicAction Meta node";
        this.setPositionZ(GraphVisConfig.graphelements['dynactionmetanode'].z);


        this.hoverText = "Group of " + this.nodes.length + " dynamic actions";
        this.hoverTextColor = "#224400";
        this.hovertextCenterX = true;

        this.exclusiveOpening = false;

        // this.labelType = GRAPH_ELEMENT_LABEL_TYPE.ICON;
        // this.labelIconSize = size * 0.6;
        // this.labelIconPath = "afel/assets/icon-resmetanode.png";
        // this.labelZoomLevelMin = 0.5;
        this.labelZoomAdjustmentBlocked = true;
    }


    public expandNodes(animated, onFinishCb = null) {
        super.expandNodes(animated, onFinishCb);
        this.nodes.forEach((n:NodeDynAction) => {
            let rN = n.getConnectedResourceNode();
            rN.setPosition(rN.getOrigPosition()['x'],
                rN.getOrigPosition()['y']);
            rN.setIsVisible(true);
        });
    }

    public collapseNodes(animated, onFinishCb = null) {
        super.collapseNodes(animated, onFinishCb);
        this.nodes.forEach((n:NodeDynAction) => {
            let rN = n.getConnectedResourceNode();
            rN.setIsVisible(false);
        });
    }


    public onIntersectStart() {
        this.nodes.forEach((n:NodeDynAction) => {
            n.getShadowNodes().forEach((sn:ShadowNodeSimple) => {
                sn.setIsVisible(true);
            })
        });
        super.onIntersectStart();
    }

    public onIntersectLeave() {
        this.nodes.forEach((n:NodeDynAction) => {
            n.getShadowNodes().forEach((sn:ShadowNodeSimple) => {
                sn.setIsVisible(false);
            })
        });
        super.onIntersectLeave();
    }


    public highlight(render) {
        this.nodes.forEach((dn:NodeDynAction) => {
            dn.highlight(render);
        });
        super.highlight(render)
    }


    public deHighlight(render) {
        this.nodes.forEach((dn:NodeDynAction) => {
            dn.deHighlight(render);
        });
        super.deHighlight(render)
    }
}
