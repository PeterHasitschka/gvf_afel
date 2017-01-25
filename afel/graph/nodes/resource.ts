import {NodeSimple} from "../../../gvfcore/components/graphvis/graphs/nodes/nodelementsimple";
import {INTERGRAPH_EVENTS, InterGraphEventService} from "../../../gvfcore/services/intergraphevents.service";
import {GraphVisConfig} from "../../../gvfcore/components/graphvis/config";
import {Plane} from "../../../gvfcore/components/plane/plane";
import {DataAbstract} from "../../../gvfcore/components/graphvis/data/dataabstract";

/**
 * A Resource node, derived from @see{NodeSimple}
 * @author Peter Hasitschka
 */
export class NodeResource extends NodeSimple {

    public static IDENTIFIER = "NODE RESOURCE";

    constructor(x:number, y:number, protected dataEntity:DataAbstract, plane:Plane) {
        super(x, y, dataEntity, plane);

        this.color = GraphVisConfig.graphelements['resourcenode'].color;
        this.setColor(this.color);
        this.name = NodeResource.IDENTIFIER;
    }


}