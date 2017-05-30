import {NodeSimple} from "../../../../gvfcore/components/graphvis/graphs/nodes/nodelementsimple";
import {GraphVisConfig} from "../../../../gvfcore/components/graphvis/config";
import {Plane} from "../../../../gvfcore/components/plane/plane";
import {DataAbstract} from "../../../../gvfcore/components/graphvis/data/dataabstract";
import {AfelResourceDataEntity} from "../../data/resource";

/**
 * A AfelResourceDataEntity node, derived from @see{NodeSimple}
 * @author Peter Hasitschka
 */
export class NodeResource extends NodeSimple {

    public static IDENTIFIER = "Node AfelResourceDataEntity";

    constructor(x:number, y:number, protected dataEntity:AfelResourceDataEntity, plane:Plane, options:Object) {
        super(x, y, dataEntity, plane, options);

        this.color = GraphVisConfig.graphelements['resourcenode'].color;
        this.setColor(this.color);
        this.name = NodeResource.IDENTIFIER;
        this.hoverText = this.getDataEntity().getData("type");
        this.hoverTextColor = "#0000AA";
    }


}