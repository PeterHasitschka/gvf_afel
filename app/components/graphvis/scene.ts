import {GraphVisConfig} from './config';
import {SceneMouseInteractions} from "./scenemouseinteractions";


//const THREE = require('../../../node_modules/three/build/three.js');

/**
 * Container holding the THREE.js Scene
 * Should act as an interface between the logic and THREE.js
 * @author Peter Hasitschka
 */
export class GraphScene {

    private threeScene:THREE.Scene;
    private threeRenderer:THREE.WebGLRenderer;
    private threeCamera:THREE.Camera;
    private threeRaycaster:THREE.Raycaster;
    private SceneMouseInteractions:SceneMouseInteractions;
    private objectGroup:THREE.Object3D;


    /**
     * @constructor of the GraphScene
     * @param{HTMLMElement} container - Container to hold the canvas
     * @param{Object} dimensions - Simple object holding 'x' and 'y' value, defining the size
     */
    constructor(private container:HTMLElement, private dimensions:Object) {
        var config = GraphVisConfig.scene;
        var canvasW = dimensions["x"],
            canvasH = dimensions["y"];

        this.threeRenderer = new THREE.WebGLRenderer({alpha: true, antialias: true});

        /**
         this.threeCamera = new THREE.OrthographicCamera(
         canvasW / -2,
         canvasW / 2,
         canvasH / 2,
         canvasH / -2,
         config.near,
         config.far);
         **/

        this.threeCamera = new THREE.PerspectiveCamera(45, canvasW / canvasH, config.near, config.far);
        this.threeScene = new THREE.Scene();


        this.threeScene.add(this.threeCamera);

        this.threeCamera.position.z = config.camera.z;

        this.threeRenderer.setSize(canvasW, canvasH);
        this.threeRenderer.setClearColor(0xffffff, 0);

        this.container.appendChild(this.threeRenderer.domElement);

        this.SceneMouseInteractions = new SceneMouseInteractions(this);
        this.threeRaycaster = new THREE.Raycaster();

        this.objectGroup = new THREE.Object3D();
        this.threeScene.add(this.objectGroup);
    }

    /**
     * Adding an object to the scene's container
     * @param obj
     */
    public addObject(obj:THREE.Object3D) {
        this.objectGroup.add(obj);
    }

    /**
     * Call the 'render' method of the THREE Renderer
     */
    public render():void {
        this.threeRenderer.render(this.threeScene, this.threeCamera);
    }


    public getThreeCamera():THREE.Camera {
        return this.threeCamera;
    }

    public getThreeRaycaster():THREE.Raycaster {
        return this.threeRaycaster;
    }

    public getThreeScene():THREE.Scene {
        return this.threeScene;
    }

    public getThreeRenderer():THREE.WebGLRenderer {
        return this.threeRenderer;
    }

    public getContainer():HTMLElement {
        return this.container;
    }
    public getContainer():HTMLElement {
        return this.container;
    }

    /**
     * Returning the container that holds all the scene's objects
     * @returns {THREE.Object3D}
     */
    public getObjectGroup():THREE.Object3D {
        return this.objectGroup;
    }
}