import {NodeSimple} from "../../../../gvfcore/components/graphvis/graphs/nodes/nodelementsimple";
import {Plane} from "../../../../gvfcore/components/plane/plane";
import {GraphVisConfig} from "../../../../gvfcore/components/graphvis/config";
import {AfelLearnerDataEntity} from "../../data/learner";
import {AfelDataSourceGnoss} from "../../../data/gnossdata/afeldatasourcegnoss";
import {AfelDataService} from "../../../data/afeldata.service";
import {AfelResourceDataEntity} from "../../data/resource";
import {UiService} from "../../../../gvfcore/services/ui.service";
/**
 * A AfelLearnerDataEntity node, derived from @see{NodeSimple}
 * @author Peter Hasitschka
 */
export class NodeLearner extends NodeSimple {

    public static IDENTIFIER = "Node AfelLearnerDataEntity";
    protected affiliatedTopButton = null;

    constructor(x:number, y:number, protected dataEntity:AfelLearnerDataEntity, plane:Plane, options:Object) {
        super(x, y, dataEntity, plane, options);

        this.color = GraphVisConfig.graphelements['learnernode'].color;
        this.setColor(this.color);
        this.name = NodeLearner.IDENTIFIER;

        this.hoverText = this.getDataEntity().getData("hash");
        this.hoverTextColor = "#00AA00";
    }


    public select(render = false) {
        let button = AfelDataService.getInstance().addButtonLoadResourcesByLearner(this.dataEntity.getId(), this.plane);
        this.affiliatedTopButton = button;
        super.select(render);
    }

    public deSelect(render = false) {

        if (this.affiliatedTopButton) {
            UiService.getInstance().removeTopButton(this.affiliatedTopButton);
            this.affiliatedTopButton = null;
        }
        super.deSelect(render);
    }
}