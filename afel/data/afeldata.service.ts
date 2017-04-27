

import {DataService} from "../../gvfcore/services/data.service";
import {AfelDataSourceSolr} from "./solr/afeldatasourcesolr";
import {AfelDataSourceInterace} from "./datasource_interface";
export class AfelDataService {

    static instance:AfelDataService;
    static isCreating:Boolean = false;
    private dataSource:AfelDataSourceInterace;

    constructor() {
        if (!AfelDataService.isCreating) {
            return AfelDataService.getInstance();
        }
        this.dataSource = new AfelDataSourceSolr(null);
    }

    static getInstance() {
        if (AfelDataService.instance == null) {
            AfelDataService.isCreating = true;
            AfelDataService.instance = new AfelDataService();
            AfelDataService.isCreating = false;
        }
        return AfelDataService.instance;
    }


    getDataSource() {
        return this.dataSource;
    }

}