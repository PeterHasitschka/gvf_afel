import {Plane} from "../../../../gvfcore/components/plane/plane";
import {ButtonIconed} from "./buttonIconed";
import {AfelMetanodeResources} from "../metanodes/resGroup";
import {MetanodeExpandable} from "../../../../gvfcore/components/graphvis/graphs/metanodes/metanodeexpandable";
import {NodeResource} from "../nodes/resource";
export class ButtonHideAllResources extends ButtonIconed {

    public static IDENTIFIER = "Button Hide All Resources Of Groups";

    constructor(x:number, y:number, plane:Plane, options:Object) {
        if (!options)
            options = {};
        if (typeof options['color'] === "undefined")
            options['color'] = 0x5555FF;
        super(x, y, plane, options);

        this.name = ButtonHideAllResources.IDENTIFIER;
        this.hoverText = "Hide Resources";
        this.hoverTextColor = "#5555FF";
        this.labelIconPath = "afel/assets/icon-collapse-resources.png";
    }


    public onClick():void {
        AfelMetanodeResources.getAllNodes().forEach((nM:MetanodeExpandable) => {
            if (nM.constructor !== AfelMetanodeResources)
                return;
            nM.collapseNodes(false, null);
            nM.getSubNodes().forEach((n:NodeResource) => {
                n.setIsVisible(false);
            })
        });
    }

}