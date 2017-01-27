import {NodeSimple} from "../../../../gvfcore/components/graphvis/graphs/nodes/nodelementsimple";
import {GraphVisConfig} from "../../../../gvfcore/components/graphvis/config";
import {Plane} from "../../../../gvfcore/components/plane/plane";
import {DataAbstract} from "../../../../gvfcore/components/graphvis/data/dataabstract";
import {Resource} from "../../data/resource";

/**
 * A Resource node, derived from @see{NodeSimple}
 * @author Peter Hasitschka
 */
export class NodeResource extends NodeSimple {

    public static IDENTIFIER = "Node Resource";

    constructor(x:number, y:number, protected dataEntity:Resource, plane:Plane) {
        super(x, y, dataEntity, plane);

        this.color = GraphVisConfig.graphelements['resourcenode'].color;
        this.highlightColor = GraphVisConfig.graphelements['resourcenode'].highlightcolor;
        this.setColor(this.color);
        this.name = NodeResource.IDENTIFIER;
    }


}