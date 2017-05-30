import {NodeSimple} from "../../../../gvfcore/components/graphvis/graphs/nodes/nodelementsimple";
import {GraphVisConfig} from "../../../../gvfcore/components/graphvis/config";
import {Plane} from "../../../../gvfcore/components/plane/plane";
import {AfelTagDataEntity} from "../../data/tag";

/**
 * A AfelResourceDataEntity node, derived from @see{NodeSimple}
 * @author Peter Hasitschka
 */
export class NodeTag extends NodeSimple {

    public static IDENTIFIER = "Node Tag";

    constructor(x:number, y:number, protected dataEntity:AfelTagDataEntity, plane:Plane, options:Object) {
        super(x, y, dataEntity, plane, options);

        this.color = GraphVisConfig.graphelements['tagnode'].color;
        this.setColor(this.color);
        this.name = NodeTag.IDENTIFIER;

        this.hoverText = this.getDataEntity().getData("tag");
        this.hoverTextColor = "#AA0000";
    }


}