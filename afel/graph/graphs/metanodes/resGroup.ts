import {MetanodeSimple} from "../../../../gvfcore/components/graphvis/graphs/metanodes/metanodesimple";
import {NodeAbstract} from "../../../../gvfcore/components/graphvis/graphs/nodes/nodeelementabstract";
import {Plane} from "../../../../gvfcore/components/plane/plane";
import {MetanodeAbstract} from "../../../../gvfcore/components/graphvis/graphs/metanodes/metanodeabstract";
import {NodeResource} from "../nodes/resource";
export class AfelMetanodeResources extends MetanodeAbstract {

    protected areResNodesCollapsed;

    constructor(x:number, y:number, nodes:NodeResource[], plane:Plane, size = null) {
        if (size === null)
            size = nodes.length;
        super(x, y, nodes, plane, {'size': size});
        this.areResNodesCollapsed = false;
        this.name = "Resource Meta node";
    }


    public toggleCollapseResNodes(animated, onFinishCb = null) {
        if (!this.areResNodesCollapsed)
            this.collapseResNodes(false, onFinishCb);
        else
            this.expandResNodes(false, onFinishCb);
    }

    public collapseResNodes(animated, onFinishCb = null) {
        this.areResNodesCollapsed = true;
        let posX = this.getPosition()['x'];
        let posY = this.getPosition()['y'];

        this.nodes.forEach((n:NodeResource) => {
            n.saveOrigPosition(true);
            if (!animated) {
                n.setPosition(posX, posY);
                if (onFinishCb)
                    onFinishCb();
            }
            else {
                console.warn("Animated collapsing of resources on metanode not implemented yet");
                if (onFinishCb)
                    onFinishCb();
            }
            n.setIsVisible(false);
        });
        this.plane.getGraphScene().render();
    }

    public expandResNodes(animated, onFinishCb = null) {
        this.areResNodesCollapsed = false;

        this.nodes.forEach((n:NodeResource) => {
            let origPos = n.getOrigPosition();
            if (!animated) {
                n.setPosition(origPos['x'], origPos['y']);
                if (onFinishCb)
                    onFinishCb();
            }
            else {
                console.warn("Animated expansion of resources on metanode not implemented yet");
                if (onFinishCb)
                    onFinishCb();
            }
            n.setIsVisible(true);
        });
        this.plane.getGraphScene().render();
    }

    public onClick() {
        this.toggleCollapseResNodes(false, function () {
            console.log("TOGGLED RES-METANODE-POS");
        });
        super.onClick();
    }
}
