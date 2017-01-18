import {Component} from '@angular/core';
import {GraphScene} from '../graphvis/scene';
import {Learner} from '../graphvis/data/learner';
import {GraphVisConfig} from '../graphvis/config';
import {GraphAbstract} from '../graphvis/graphs/abstract';
import {UiService} from "../../services/ui.service";

/**
 * The Plane Object holds the @see{GraphScene} element and connects to the
 * HTML element.
 * It gets initialized by its component @see{PlaneComponent}.
 * The @see{GraphScene} gets created and the graph, defined in the
 * constructor's parameter is built.
 * Finally the graph's init() method is called.
 */
export class Plane {

    private containerId:number;
    private scene:GraphScene;
    static containerPrefix:string = "graphvisplanecontainer_";
    private graph:GraphAbstract;
    private canvasDimensions;

    /**
     * @param{string} name - Defining the graph's name
     * @param{string} graphtype - @see{GraphVisConfig} for possible strings
     */
    constructor(private name:string, private graphtype:string, public uiService:UiService) {

    }

    /**
     * Called after making sure the container exists
     * @param{number} containerId - An Id that gets combined with the containerPrefix
     * to get the (existing) element for storing the scene in it.
     *
     * At first the @see{GraphScene} gets created.
     * Then the @see{GraphAbstract} derivation.
     * Finally the graph's init method is called
     */
    public initScene(containerId:number) {

        /**
         * Determine HTML container
         */
        this.containerId = containerId;
        this.canvasDimensions = this.calculateCanvasSize();
        var container = document.getElementById(Plane.containerPrefix + this.containerId);

        /**
         * Create THREE.js Scene within GraphScene Container
         */
        this.scene = new GraphScene(container, this.canvasDimensions);
        this.createBackPlane();

        /**
         * Create Graph, depending on graphtype-string
         */
        this.graph = new GraphVisConfig.active_graphs[this.graphtype](this);
        // try {
        // } catch (e) {
        //
        //     console.error("Could not create graph of type '" + this.graphtype + "'!", e);
        // }
        // Load Data from DataService and build the graph
        this.graph.init();

    }

    /**
     * Calculating the width and height of the defined container
     */
    private calculateCanvasSize():Object {
        var container = document.getElementById(Plane.containerPrefix + this.containerId);
        return {x: container.clientWidth - 10, y: container.clientHeight - 30};
    }

    public getCanvasSize():Object {
        return this.canvasDimensions;
    }

    /**
     * Creating a plane behind all nodes. Useful when rotating etc.
     */
    private createBackPlane() {
        var squareGeometry = new THREE.Geometry();
        let config = GraphVisConfig.scene.backplane;
        let padding = config.padding;
        let z = config.z;
        let halfW = this.canvasDimensions['x'] / 2 - padding;
        let halfH = this.canvasDimensions['y'] / 2 - padding;

        squareGeometry.vertices.push(new THREE.Vector3(0 - halfW, halfH, 0));
        squareGeometry.vertices.push(new THREE.Vector3(halfW, halfH, 0));
        squareGeometry.vertices.push(new THREE.Vector3(halfW, 0 - halfH, 0));
        squareGeometry.vertices.push(new THREE.Vector3(0 - halfW, 0 - halfH, 0));
        squareGeometry.faces.push(new THREE.Face3(0, 1, 2));
        squareGeometry.faces.push(new THREE.Face3(0, 2, 3));

        var squareMaterial = new THREE.MeshBasicMaterial({
            color: config.color,
            side: THREE.DoubleSide
        });

        var squareMesh = new THREE.Mesh(squareGeometry, squareMaterial);
        squareMesh.position.set(0, 0.0, z);
        //this.dummyRotate(this.scene.getObjectGroup(), new THREE.Vector3(0, 0 - halfW, z), -0.3);
        this.scene.addObject(squareMesh);
    }

    private dummyRotate(object, axis, radians) {
        var rotationMatrix = new THREE.Matrix4();

        rotationMatrix.makeRotationAxis(axis.normalize(), radians);
        rotationMatrix.multiply(object.matrix);                       // pre-multiply
        object.matrix = rotationMatrix;
        object.rotation.setFromRotationMatrix(object.matrix);

    }


    public getName():string {
        return this.name;
    }

    public getContainerPrefix():string {
        return Plane.containerPrefix;
    }

    public getGraphScene():GraphScene {
        if (!this.scene)
            console.error("Could not get Graph Scene - Not initialized yet?");
        return this.scene;
    }

    public getGraph():GraphAbstract {
        return this.graph;
    }


    public getGraphType():string {
        return this.graphtype;
    }

}