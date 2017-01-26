import {BasicGroup} from "../../../../gvfcore/components/graphvis/data/databasicgroup";
import {BasicEntity} from "../../../../gvfcore/components/graphvis/data/databasicentity";
export abstract class Community extends BasicGroup {

    protected static dataList:Community[] = [];
    //protected entities:BasicEntity[] = [];

    constructor(id:number, entities:BasicEntity[], data:Object) {
        super(id, entities, data);

        Community.dataList.push(this);
    }


    public static getDataList():Community[] {
        return Community.dataList;
    }

}