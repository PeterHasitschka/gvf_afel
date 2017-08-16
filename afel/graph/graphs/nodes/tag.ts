import {NodeSimple} from "../../../../gvfcore/components/graphvis/graphs/nodes/nodelementsimple";
import {GraphVisConfig} from "../../../../gvfcore/components/graphvis/config";
import {Plane} from "../../../../gvfcore/components/plane/plane";
import {AfelTagDataEntity} from "../../data/tag";
import {AfelDataSourceGnoss} from "../../../data/gnossdata/afeldatasourcegnoss";
import {AfelDataService} from "../../../data/afeldata.service";
import {AfelResourceDataEntity} from "../../data/resource";
import {UiService} from "../../../../gvfcore/services/ui.service";

/**
 * A AfelResourceDataEntity node, derived from @see{NodeSimple}
 * @author Peter Hasitschka
 */
export class NodeTag extends NodeSimple {

    public static IDENTIFIER = "Node Tag";
    protected affiliatedTopButton = null;


    constructor(x:number, y:number, protected dataEntity:AfelTagDataEntity, plane:Plane, options:Object) {
        super(x, y, dataEntity, plane, options);

        this.color = GraphVisConfig.graphelements['tagnode'].color;
        this.setColor(this.color);
        this.name = NodeTag.IDENTIFIER;

        this.hoverText = this.getDataEntity().getData("name");
        this.hoverTextColor = "#AA0000";

        this.labelZoomAdjustmentBlocked = true;
    }


    public select(render = false) {
        let button = AfelDataService.getInstance().addButtonLoadResourcesByTag(this.dataEntity.getId(), this.plane);
        this.affiliatedTopButton = button;
        super.select(render);
    }

    public deSelect(render = false) {

        if (this.affiliatedTopButton) {
            UiService.getInstance().removeTopButton(this.affiliatedTopButton);
            this.affiliatedTopButton = null;
        }
        super.deSelect(render);
    }

}



