import {ElementAbstract} from "../../../../gvfcore/components/graphvis/graphs/graphelementabstract";
import {Plane} from "../../../../gvfcore/components/plane/plane";
import {Label} from "../../../../gvfcore/components/graphvis/graphs/labels/label";


export enum AFEL_TIMELINEGRID_TIMESCALE {
    DAILY,
    WEEKLY,
    MONTHLY
}

export class AfelTimeLineGrid extends ElementAbstract {


    constructor(startDate:Date,
                endDate:Date,
                width:number,
                height:number,
                verticalSliceNum:number,
                timescale:AFEL_TIMELINEGRID_TIMESCALE,
                plane:Plane,
                options:Object) {
        super(0, 0, null, plane, options);
        this.add(this.createGridMesh(startDate, endDate, height, width, verticalSliceNum, timescale));
    }


    protected createGridMesh(startDate:Date,
                             endDate:Date,
                             height:number,
                             width:number,
                             verticalSliceNum:number,
                             timescale:AFEL_TIMELINEGRID_TIMESCALE):THREE.Group {

        let gridGroup = new THREE.Group();


        let baseFrameWidth = 2;
        let lineZ = -10;


        let frameMaterial = new THREE.LineBasicMaterial({
            color: 0x000000,
            linewidth: baseFrameWidth,
            opacity: 1.0,
            transparent: true
        });

        let bottomlineY = 0 - height / verticalSliceNum;
        // THE OUTER 'FRAME'
        let vertFrameLineGeom = new THREE.Geometry();
        vertFrameLineGeom.vertices.push(new THREE.Vector3(0, bottomlineY, lineZ));
        vertFrameLineGeom.vertices.push(new THREE.Vector3(0, height - height / verticalSliceNum, lineZ));
        let frameLineVert = new THREE.Line(vertFrameLineGeom, frameMaterial);
        gridGroup.add(frameLineVert);

        let horzFrameLineGeom = new THREE.Geometry();
        horzFrameLineGeom.vertices.push(new THREE.Vector3(0, bottomlineY, lineZ));
        horzFrameLineGeom.vertices.push(new THREE.Vector3(width, bottomlineY, lineZ));
        let frameLineHor = new THREE.Line(horzFrameLineGeom, frameMaterial);
        gridGroup.add(frameLineHor);


        // THE HORIZONTAL LINES SEPARATING THE RESOURCE GROUPS
        let scaleLinesMaterial = new THREE.LineBasicMaterial({
            color: 0x000000,
            linewidth: 0.8,
            opacity: 0.3,
            transparent: true
        });

        for (let i = 0; i < verticalSliceNum; i++) {
            let horzScaleLineGeom = new THREE.Geometry();
            let yPos = i / verticalSliceNum * height;
            horzScaleLineGeom.vertices.push(new THREE.Vector3(0, yPos, lineZ));
            horzScaleLineGeom.vertices.push(new THREE.Vector3(width, yPos, lineZ));
            let line = new THREE.Line(horzScaleLineGeom, scaleLinesMaterial);
            gridGroup.add(line);
        }


        let addVertLineFct = function (date:Date) {

            let labelTxt = date.getDate() + "." + date.getMonth() + "." + date.getFullYear();
            let xPos = (date.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime()) * width;
            let vertScaleLineGeom = new THREE.Geometry();
            vertScaleLineGeom.vertices.push(new THREE.Vector3(xPos, bottomlineY, lineZ));
            vertScaleLineGeom.vertices.push(new THREE.Vector3(xPos, height - (height / verticalSliceNum), lineZ));
            let line = new THREE.Line(vertScaleLineGeom, scaleLinesMaterial);
            gridGroup.add(line);

            let labelSettings = {
                color: "grey",
                fontSize: 20,
                strokeWidth: 0,
                centerX: false,
                rotateDegree: 45
            };
            let label = new Label(this.plane, labelTxt, xPos, -20 - (height / verticalSliceNum), labelSettings);

        }.bind(this);


        let iterateDate = new Date(startDate.getTime());
        switch (timescale) {
            case AFEL_TIMELINEGRID_TIMESCALE.WEEKLY :
                while (iterateDate <= endDate) {
                    if (iterateDate.getDay() === 1) { //MONDAY
                        addVertLineFct(iterateDate);
                    }
                    iterateDate.setDate(iterateDate.getDate() + 1);
                }
                break;

            case AFEL_TIMELINEGRID_TIMESCALE.MONTHLY:
                while (iterateDate <= endDate) {
                    if (iterateDate.getDate() === 1) {
                        let xPos = (endDate.getTime() - startDate.getTime()) / iterateDate.getTime() * width;
                        addVertLineFct(iterateDate);
                    }
                    iterateDate.setDate(iterateDate.getDate() + 1);
                }
                break;

            default:
                console.warn("Timeline-Grid: This timescale is NOT IMPLMENTED YET!");

        }


        return gridGroup;
    }


}
