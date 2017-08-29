import {ShadowNodeSimple} from "../../../../gvfcore/components/graphvis/graphs/nodes/shadownodesimple";
import {NodeDynAction} from "./dynaction";
import {Plane} from "../../../../gvfcore/components/plane/plane";

export class DynActionShadowNode extends ShadowNodeSimple {
    constructor(x:number, y:number, linkedNode:NodeDynAction, plane:Plane, options:Object) {
        super(x, y, linkedNode, plane, options);
        this.setIgnoreHover(true);
    }
}