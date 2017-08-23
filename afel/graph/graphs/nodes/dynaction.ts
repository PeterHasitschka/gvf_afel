import {NodeSimple} from "../../../../gvfcore/components/graphvis/graphs/nodes/nodelementsimple";
import {GraphVisConfig} from "../../../../gvfcore/components/graphvis/config";
import {Plane} from "../../../../gvfcore/components/plane/plane";
import {AfelTagDataEntity} from "../../data/tag";
import {AfelDataSourceGnoss} from "../../../data/gnossdata/afeldatasourcegnoss";
import {AfelDataService} from "../../../data/afeldata.service";
import {AfelResourceDataEntity} from "../../data/resource";
import {UiService} from "../../../../gvfcore/services/ui.service";
import {AfelDynActionDataEntity} from "../../data/dynaction";
import {NodeResource} from "./resource";
import {ElementAbstract} from "../../../../gvfcore/components/graphvis/graphs/graphelementabstract";

/**
 * A AfelDynActionDataEntity node, derived from @see{NodeSimple}
 * @author Peter Hasitschka
 */
export class NodeDynAction extends NodeSimple {

    public static IDENTIFIER = "Node Dynamic Action";

    constructor(x:number, y:number, dataEntity:AfelDynActionDataEntity, plane:Plane, options:Object) {
        if (options === null)
            options = {};
            options["size"] = 10;
        super(x, y, dataEntity, plane, options);

        this.color = GraphVisConfig.graphelements['dynactionnode'].color;
        this.setColor(this.color);
        this.name = NodeDynAction.IDENTIFIER;

        this.hoverText = this.getDataEntity().getData("action_date");
        this.hoverTextColor = "#AA0000";

        this.labelZoomAdjustmentBlocked = true;
    }

    public getConnectedResourceNode():NodeResource {

        let res = (<AfelDynActionDataEntity>this.dataEntity).getConnectedResource();
        let resNode:NodeResource = null;
        let BreakException = {};
        try {
            res.getRegisteredGraphElements().forEach((elm:ElementAbstract) => {
                if (elm.constructor === NodeResource && elm.getPlane().getId() === this.getPlane().getId()) {
                    resNode = <NodeResource>elm;
                    throw BreakException;
                }
            });
        } catch (e) {
            if (e !== BreakException)
                throw e;
        }

        return resNode;
    }
}



