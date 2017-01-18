import {NodeAbstract} from '../nodes/abstract';
import {Plane} from '../../../plane/plane';
import {LayoutInterface} from "./layoutinterface";
import {EdgeAbstract} from "../edges/abstract";

/**
 * Abstract class for different graph layouts (e.g. random graph, FDL-Graph, Special Community-Graphs
 */
export abstract class GraphLayoutAbstract implements LayoutInterface {

    /**
     *
     * @param plane Plane-Instance
     * @param nodes List of nodes
     * @param edges List of edges
     */
    constructor(protected plane:Plane, protected nodes:NodeAbstract[], protected edges:EdgeAbstract[]) {
    }

    protected distributeRandom(onFinish):void{
        let padding = 0;
        let dimensions = this.plane.getCanvasSize();
        let xRange = dimensions['x'] - padding;
        let yRange = dimensions['y'] - padding;
        this.nodes.forEach(function (node:NodeAbstract, idx:number) {
            var posX = Math.random() * xRange - xRange / 2;
            var posY = Math.random() * yRange - yRange / 2;
            node.setPosition(posX, posY);
        });
        onFinish();
    }

    /**
     * Called at first to initialize the nodes' positions
     * @param onFinish Callback after finish
     */
    public setInitPositions(onFinish):void {
    }

    /**
     * Calculate the position of the nodes.
     * Since this may happen iteratively (and asynchronous), a callback fct may be necessary to set
     * @param onFinish Callback after finish
     */
    public calculateLayout(onFinish):void {

    }
}