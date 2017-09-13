import {Plane} from "../../../../gvfcore/components/plane/plane";
import {ButtonIconed} from "./buttonIconed";
import {AfelMetanodeResources} from "../metanodes/resGroup";
import {MetanodeExpandable} from "../../../../gvfcore/components/graphvis/graphs/metanodes/metanodeexpandable";
import {NodeResource} from "../nodes/resource";
import {AfelMetanodeDynActions} from "../metanodes/dynActionGroup";
import {NodeDynAction} from "../nodes/dynaction";
export class ButtonShowAllDynActions extends ButtonIconed {

    public static IDENTIFIER = "Button Show All Dynamic Action Nodes";

    constructor(x:number, y:number, plane:Plane, options:Object) {
        if (!options)
            options = {};
        if (typeof options['color'] === "undefined")
            options['color'] = 0xefc700;
        super(x, y, plane, options);

        this.name = ButtonShowAllDynActions.IDENTIFIER;
        this.hoverText = "Show All Dynamic Action Nodes";
        this.hoverTextColor = "#000000";
        this.labelIconPath = "afel/assets/icon-expand-resources.png";
    }


    public onClick():void {
        AfelMetanodeResources.getAllNodes().forEach((nM:MetanodeExpandable) => {
            if (nM.constructor !== AfelMetanodeDynActions)
                return;
            nM.expandNodes(false, null);
            // nM.getSubNodes().forEach((n:NodeDynAction) => {
            //     // n.setIsVisible(true);
            // })
        });
    }

}