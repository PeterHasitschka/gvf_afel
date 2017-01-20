import {NodeSimple} from "../../../gvfcore/components/graphvis/graphs/nodes/simple";
import {DataAbstract} from "../../../gvfcore/components/graphvis/data/abstract";
import {Plane} from "../../../gvfcore/components/plane/plane";
import {GraphVisConfig} from "../../../gvfcore/components/graphvis/config";
import {INTERGRAPH_EVENTS, InterGraphEventService} from "../../../gvfcore/services/intergraphevents.service";
/**
 * A Learner node, derived from @see{NodeSimple}
 * @author Peter Hasitschka
 */
export class NodeLearner extends NodeSimple {

    constructor(x:number, y:number, protected dataEntity:DataAbstract, plane:Plane) {
        super(x, y, dataEntity, plane);

        this.color = GraphVisConfig.nodes['learnernode'].color;
        this.setColor(this.color);
    }

    /**
     * On Mouse-Hover
     * Sending an Event for notifying that node was intersected
     */
    public onIntersectStart():void {
        InterGraphEventService.getInstance().send(INTERGRAPH_EVENTS.LEARNER_NODE_HOVERED, this);
        super.onIntersectStart();
    }

    /**
     * On Mouse-Leave
     * Sending an Event for notifying that node was left
     */
    public onIntersectLeave():void {
        InterGraphEventService.getInstance().send(INTERGRAPH_EVENTS.LEARNER_NODE_LEFT, this);
        super.onIntersectLeave();
    }
}