import {NodeSimple} from "../../../gvfcore/components/graphvis/graphs/nodes/nodelementsimple";
import {DataAbstract} from "../../../gvfcore/components/graphvis/data/dataabstract";
import {Plane} from "../../../gvfcore/components/plane/plane";
import {GraphVisConfig} from "../../../gvfcore/components/graphvis/config";
import {INTERGRAPH_EVENTS, InterGraphEventService} from "../../../gvfcore/services/intergraphevents.service";
import {Learner} from "../data/learner";
/**
 * A Learner node, derived from @see{NodeSimple}
 * @author Peter Hasitschka
 */
export class NodeLearner extends NodeSimple {

    public static IDENTIFIER = "NODE LEARNER";

    constructor(x:number, y:number, protected dataEntity:Learner, plane:Plane) {
        super(x, y, dataEntity, plane);

        this.color = GraphVisConfig.graphelements['learnernode'].color;
        this.setColor(this.color);
        this.name = NodeLearner.IDENTIFIER;
    }


}