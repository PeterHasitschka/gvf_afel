import {Plane} from "../../../../gvfcore/components/plane/plane";
import {ButtonIconed} from "./buttonIconed";
import {AfelMetanodeResources} from "../metanodes/resGroup";
import {MetanodeExpandable} from "../../../../gvfcore/components/graphvis/graphs/metanodes/metanodeexpandable";
export class ButtonShowAllResources extends ButtonIconed {

    public static IDENTIFIER = "Button Show All Resources Of Groups";

    constructor(x:number, y:number, plane:Plane, options:Object) {
        if (!options)
            options = {};
        if (typeof options['color'] === "undefined")
            options['color'] = 0x5555FF;
        super(x, y, plane, options);

        this.name = ButtonShowAllResources.IDENTIFIER;
        this.hoverText = "Show All Resources";
        this.hoverTextColor = "#5555FF";
        this.labelIconPath = "afel/assets/icon-expand-resources.png";
    }


    public onClick():void {
        AfelMetanodeResources.getAllNodes().forEach((n:MetanodeExpandable) => {
            if (n.constructor !== AfelMetanodeResources)
                return;
            n.expandNodes(false, null, true);
        });
    }

}