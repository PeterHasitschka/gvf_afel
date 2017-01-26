import {NodeSimple} from "../../../../gvfcore/components/graphvis/graphs/nodes/nodelementsimple";
import {Plane} from "../../../../gvfcore/components/plane/plane";
import {GraphVisConfig} from "../../../../gvfcore/components/graphvis/config";
import {Learner} from "../../data/learner";
/**
 * A Learner node, derived from @see{NodeSimple}
 * @author Peter Hasitschka
 */
export class NodeLearner extends NodeSimple {

    public static IDENTIFIER = "Node Learner";

    constructor(x:number, y:number, protected dataEntity:Learner, plane:Plane) {
        super(x, y, dataEntity, plane);

        this.color = GraphVisConfig.graphelements['learnernode'].color;
        this.setColor(this.color);
        this.name = NodeLearner.IDENTIFIER;
    }


}