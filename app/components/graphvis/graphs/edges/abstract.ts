import {GraphVisConfig} from '../../config';
import {start} from "repl";
import {GraphObject} from "../graphobjectinterface";
import {Plane} from "../../../plane/plane";
import {NodeAbstract} from "../nodes/abstract";


/**
 * Abstract class of an Edge for the GraphVis
 * Derived from the @see{THREE.Line} class.
 * Thus, it holds a geometry and a material
 * but also its two connecting nodes
 * @author Peter Hasitschka
 */
export abstract class EdgeAbstract extends THREE.Line implements GraphObject {


    protected threeMaterial:THREE.LineBasicMaterial;
    protected threeGeometry:THREE.Geometry;
    protected zPos;
    protected color:number;
    protected plane:Plane;
    protected sourceNode:NodeAbstract;
    protected destNode:NodeAbstract;
    protected addRandom;

    /**
     * Creating an edge by taking the nodes and the plane
     * Nodes and config-values define the geometry and material
     * @param sourceNode
     * @param destNode
     * @param plane
     */
    constructor(sourceNode:NodeAbstract, destNode:NodeAbstract, plane:Plane) {

        let startX:number = sourceNode.getPosition()['x'];
        let startY:number = sourceNode.getPosition()['y'];
        let endX:number = destNode.getPosition()['x'];
        let endY:number = destNode.getPosition()['y'];

        let config = GraphVisConfig.edges;
        let color = config.abstractedge.color;

        // if (this.addRandom)
        //     color = this.addRandomColorValue(color);

        let material = new THREE.LineBasicMaterial({
            color: color,
            linewidth: config.abstractedge.thickness
        });
        let geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(startX, startY, config.abstractedge.z_pos));
        geometry.vertices.push(new THREE.Vector3(endX, endY, config.abstractedge.z_pos));


        super(geometry, material);
        this.plane = plane;

        this.sourceNode = sourceNode;
        this.destNode = destNode;

        this.color = color;
        this.threeGeometry = geometry;
        this.threeMaterial = material;
        this.zPos = config.abstractedge.z_pos;
    }

    private addRandomColorValue(color:number):number {

        let variableColVal = 100;

        let colR = color >> 16;
        let colG = (color >> 8) - (colR << 8);
        let colB = color - ((color >> 8) << 8);

        console.log(color.toString(16), colR.toString(16), colG.toString(16), colB.toString(16));

        let randDiff = (variableColVal / 2) - Math.floor(Math.random() * variableColVal + 0.5);
        colR = Math.max(0x00, Math.min(0xff, colR + randDiff));
        colG = Math.max(0x00, Math.min(0xff, colG + randDiff));
        colB = Math.max(0x00, Math.min(0xff, colB + randDiff));

        color = (colR << 16) + (colG << 8) + colB;
        console.log((colR << 16).toString(16), (colG << 8).toString(16), colB.toString(16), color.toString(16), randDiff);

        return color;
    }


    /**
     * Setting a (hexadecimal) color
     * No rendering is performed!
     * @param color
     */
    public setColor(color:number) {
        this.color = color;
        this.threeMaterial.color.setHex(color);
    }

    /**
     * Updating the position of the edge by taking its nodes' position
     * No rendering is performed!
     */
    public updatePositions() {
        this.threeGeometry.vertices[0]['x'] = this.sourceNode.getPosition()['x'];
        this.threeGeometry.vertices[0]['y'] = this.sourceNode.getPosition()['y'];
        this.threeGeometry.vertices[1]['x'] = this.destNode.getPosition()['x'];
        this.threeGeometry.vertices[1]['y'] = this.destNode.getPosition()['y'];
        this.threeGeometry.verticesNeedUpdate = true;


    }

    /**
     * Callback on hovering the edge
     */
    public onIntersectStart():void {
        //console.log("Intersected an edge");
    }

    /**
     * Callback on leaving the edge
     */
    public onIntersectLeave():void {
        //console.log("UN-Intersected an edge");
    }

    /**
     * Return the Source-Node
     * @returns {NodeAbstract}
     */
    public getSourceNode():NodeAbstract {
        return this.sourceNode;
    }

    /**
     * Return the Destination-Node
     * @returns {NodeAbstract}
     */
    public getDestNode():NodeAbstract {
        return this.destNode;
    }
}


