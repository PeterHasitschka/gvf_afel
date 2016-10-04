import {Injectable} from "@angular/core";
import {SideInfoComponent} from "../components/app/sideinfo/sideinfo.component";
import {SideInfoModel, SideInfoPositions} from "../components/app/sideinfo/sideinfomodel";
import {BehaviorSubject} from "rxjs/Rx";
import {GraphworkspaceComponent} from "../components/graphworkspace/graphworkspace.component";


@Injectable()
/**
 * Service for allowing the UI elements to communicate.
 * Optional singleton concept => Usage in non-components (where injection does not work): DataService.getInstance()
 * @author Peter Hasitschka
 */
export class UiService {

    public sideInfoElements:SideInfoModel[];

    static instance:UiService;
    static isCreating:Boolean = false;

    private graphWorkSpaceSvgElement:HTMLElement = null;
    private graphWorkSpaceSvgElementVisible = false;

    constructor() {

        this.sideInfoElements = [];
        console.log("Created UI SERVICE");
        if (!UiService.isCreating) {
            return UiService.getInstance();
        }
    }


    /**
     * Getting the singleton instance of the Service
     * @returns {UiService}
     */
    static getInstance() {
        if (UiService.instance == null) {
            UiService.isCreating = true;
            UiService.instance = new UiService();
            UiService.isCreating = false;
        }
        return UiService.instance;
    }


    public setGraphWorkSpaceSvgElement(el:HTMLElement) {
        this.graphWorkSpaceSvgElement = el;
    }

    public getGraphWorkSpaceSvgElement():HTMLElement {
        return this.graphWorkSpaceSvgElement;
    }

    public showGraphWorkSpaceSvgElement(){
        this.graphWorkSpaceSvgElementVisible = true;
    }

    public hideGraphWorkSpaceSvgElement(){
        this.graphWorkSpaceSvgElementVisible = false;
    }


    addSideInfoElement(sideInfo:SideInfoModel) {
        window.setTimeout(function () {
            this.sideInfoElements.push(sideInfo);
        }.bind(this));
    }

    getSideInfoElements():SideInfoModel[] {
        return this.sideInfoElements;
    }

}