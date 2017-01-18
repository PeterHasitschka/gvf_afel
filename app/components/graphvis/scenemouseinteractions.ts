import {GraphScene} from "./scene";
import {UiService} from "../../services/ui.service";

/**
 * Class that manages mouse interactions by recognizing intersections on THREE Objects and
 * calling registered methods on them
 * It holds all currently intersected objects to further allow recognize if objects are left
 */
export class SceneMouseInteractions {

    private mouseContainerPos = {x: null, y: null};
    private currentlyIntersected = {};



    constructor(private scene:GraphScene) {
        scene.getContainer().addEventListener('mousemove', this.onSceneMouseMove.bind(this), false);
        UiService.getInstance().getGraphWorkSpaceSvgElement().addEventListener('mousemove', this.onSceneMouseMove.bind(this), false);
    }


    /**
     * Getting intersected objects and compares them with internal list, to decide if some were
     * left or just entered. The corresponding methods on the objects are called.
     */
    public handleIntersections() {
        if (this.mouseContainerPos.x === null || this.mouseContainerPos.y === null)
            return;

        this.scene.getThreeRaycaster().setFromCamera(this.mouseContainerPos, this.scene.getThreeCamera());
        var intersects = this.scene.getThreeRaycaster().intersectObjects(this.scene.getObjectGroup().children);

        //Check for new
        let newIntersected = {};
        intersects.forEach((intersectedObj) => {
            let obj:any = intersectedObj['object'];

            if (typeof obj.onIntersectStart === 'undefined') {
                return;
            }

            let id = obj['uuid'];
            if (typeof this.currentlyIntersected[id] === 'undefined') {
                obj.onIntersectStart();
            }
            newIntersected[id] = obj;
        });

        //Check for old
        for (let oldId in this.currentlyIntersected) {
            let oldIntersectedObj = this.currentlyIntersected[oldId];
            if (typeof newIntersected[oldId] === 'undefined') {
                let obj:any = oldIntersectedObj;
                obj.onIntersectLeave();
            }
        }
        this.currentlyIntersected = newIntersected;
    }

    /**
     * Setting the current mouse position
     * This method can handle events on the overlying SVG-Element and on the plane-canvas.
     * In the first case, the local position on the canvas is calculated
     * @param event
     */
    private onSceneMouseMove(event) {

        let offsetX = event.offsetX;
        let offsetY = event.offsetY;

        /**
         * If the connection-SVG-element hides the plane, no mouse movements are registered on it.
         * The local position of the mouse on the plane is calculated.
         * If it is in range, it is handles as a common mousemovement on the canvas.
         */
        if (event.target.tagName === "svg") {
            let posX = event.x;
            let posY = event.y;
            let canvasElement = null;
            for (let i = 0; i < this.scene.getContainer().children.length; i++) {
                if (this.scene.getContainer().children[i].tagName === "CANVAS") {
                    canvasElement = this.scene.getContainer().children[i];
                    break;
                }
            }
            if (!canvasElement) {
                console.warn("Could not find canvas element on global mousemove");
                return;
            }

            let canvasTop = canvasElement.getBoundingClientRect().top;
            let canvasLeft = canvasElement.getBoundingClientRect().left;

            offsetX = posX - canvasLeft;
            offsetY = posY - canvasTop;

            if (offsetX < 0 || offsetX > canvasElement.getBoundingClientRect().width)
                return;
            if (offsetY < 0 || offsetY > canvasElement.getBoundingClientRect().height)
                return;
        } else if (event.target.tagName !== "CANVAS")
            return;

        this.mouseContainerPos.x = ( offsetX / this.scene.getThreeRenderer().getSize()["width"] ) * 2 - 1;
        this.mouseContainerPos.y = -( offsetY / this.scene.getThreeRenderer().getSize()["height"] ) * 2 + 1;
        this.handleIntersections();
    }
}