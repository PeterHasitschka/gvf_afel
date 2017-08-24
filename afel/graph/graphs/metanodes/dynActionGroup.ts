import {Plane} from "../../../../gvfcore/components/plane/plane";
import {MetanodeExpandable} from "../../../../gvfcore/components/graphvis/graphs/metanodes/metanodeexpandable";
import {NodeDynAction} from "../nodes/dynaction";
export class AfelMetanodeDynActions extends MetanodeExpandable {

    constructor(x:number, y:number, nodes:NodeDynAction[], plane:Plane, size = null) {
        super(x, y, nodes, plane, size);
        this.name = "DynamicAction Meta node";
    }
}
