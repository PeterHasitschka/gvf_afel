import {Injectable} from "@angular/core";
import {SideInfoModel} from "../components/app/sideinfo/sideinfomodel";


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
    public graphWorkSpaceSvgElementVisible = false;

    public intergraphConnections = [];

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

    public setGraphWorkSpaceSvgElementVisible(visible:boolean) {
        this.graphWorkSpaceSvgElementVisible = visible;
    }

    public getGraphWorkSpaceSvgElementVisible():boolean {
        return this.graphWorkSpaceSvgElementVisible;
    }


    addSideInfoElement(sideInfo:SideInfoModel) {
        window.setTimeout(function () {
            this.sideInfoElements.push(sideInfo);
        }.bind(this));
    }

    getSideInfoElements():SideInfoModel[] {
        return this.sideInfoElements;
    }


    addNodesToIntergraphConnection(node1, node2) {
        if (this.getGraphWorkSpaceSvgElementVisible())
            this.intergraphConnections.push([node1, node2]);
    }

    clearIntergraphConnections(){
        this.intergraphConnections = [];
    }
}