import {NodeSimple} from "../../../../gvfcore/components/graphvis/graphs/nodes/nodelementsimple";
import {Plane} from "../../../../gvfcore/components/plane/plane";
import {GraphVisConfig} from "../../../../gvfcore/components/graphvis/config";
import {AfelLearnerDataEntity} from "../../data/learner";
/**
 * A AfelLearnerDataEntity node, derived from @see{NodeSimple}
 * @author Peter Hasitschka
 */
export class NodeLearner extends NodeSimple {

    public static IDENTIFIER = "Node AfelLearnerDataEntity";

    constructor(x:number, y:number, protected dataEntity:AfelLearnerDataEntity, plane:Plane, options:Object) {
        super(x, y, dataEntity, plane, options);

        this.color = GraphVisConfig.graphelements['learnernode'].color;
        this.setColor(this.color);
        this.name = NodeLearner.IDENTIFIER;

        this.hoverText = this.getDataEntity().getData("hash");
        this.hoverTextColor = "#00AA00";
    }


}