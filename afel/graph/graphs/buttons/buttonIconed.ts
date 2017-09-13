import {ButtonSimple} from "../../../../gvfcore/components/graphvis/graphs/buttons/buttonsimple";
import {Plane} from "../../../../gvfcore/components/plane/plane";
import {GRAPH_ELEMENT_LABEL_TYPE} from "../../../../gvfcore/components/graphvis/graphs/graphelementabstract";
export class ButtonIconed extends ButtonSimple {

    public static IDENTIFIER = "Button Show All Resources Of Groups";

    constructor(x:number, y:number, plane:Plane, options:Object) {
        if (!options)
            options = {};
        if (typeof options['color'] === "undefined")
            options['color'] = 0xFF0000;
        super(x, y, plane, options);


        this.name = ButtonIconed.IDENTIFIER;

        this.hoverText = "----------";
        this.hoverTextColor = "#FF0000";


        this.labelType = GRAPH_ELEMENT_LABEL_TYPE.ICON;
        this.labelIconSize = 13;
        this.labelIconPath = "afel/assets/icon-expand-resources.png";
        this.labelZoomLevelMin = 0.0;

        this.labelZoomAdjustmentBlocked = true;
    }
}