import {NodeSimple} from "../../../../gvfcore/components/graphvis/graphs/nodes/nodelementsimple";
import {GraphVisConfig} from "../../../../gvfcore/components/graphvis/config";
import {Plane} from "../../../../gvfcore/components/plane/plane";
import {DataAbstract} from "../../../../gvfcore/components/graphvis/data/dataabstract";
import {AfelResourceDataEntity} from "../../data/resource";
import {AfelDataService} from "../../../data/afeldata.service";
import {AfelDataSourceGnoss} from "../../../data/gnossdata/afeldatasourcegnoss";
import {AutoGraph} from "../../../../gvfcore/components/graphvis/graphs/autograph";
import {AfelLearnerDataEntity} from "../../data/learner";
import {UiService} from "../../../../gvfcore/services/ui.service";
import {EdgeAbstract} from "../../../../gvfcore/components/graphvis/graphs/edges/edgeelementabstract";
import {EdgeResourceTag} from "../edges/resourcetag";

/**
 * A AfelResourceDataEntity node, derived from @see{NodeSimple}
 * @author Peter Hasitschka
 */
export class NodeResource extends NodeSimple {

    public static IDENTIFIER = "Node AfelResourceDataEntity";
    protected affiliatedTopButton = null;

    constructor(x:number, y:number, protected dataEntity:AfelResourceDataEntity, plane:Plane, options:Object) {
        super(x, y, dataEntity, plane, options);

        this.color = GraphVisConfig.graphelements['resourcenode'].color;
        this.setColor(this.color);
        this.name = NodeResource.IDENTIFIER;
        this.hoverText = this.getDataEntity().getData("title");
        this.hoverTextColor = "#0000AA";

        this.labelZoomAdjustmentBlocked = true;
    }


    public select(render = false) {
        let button = AfelDataService.getInstance().addButtonLoadLearnersByResource(this.dataEntity.getId(), this.plane);
        this.affiliatedTopButton = button;

        this.edges.forEach((e:EdgeAbstract) => {
            if (e.constructor !== EdgeResourceTag)
                return;
            (<EdgeResourceTag>e).getTagNode().setIsVisible(true);

        });

        super.select(render);
    }

    public deSelect(render = false) {

        if (this.affiliatedTopButton) {
            UiService.getInstance().removeTopButton(this.affiliatedTopButton);
            this.affiliatedTopButton = null;
        }

        this.edges.forEach((e:EdgeAbstract) => {
            if (e.constructor !== EdgeResourceTag)
                return;
            (<EdgeResourceTag>e).getTagNode().setIsVisible(false);

        });

        super.deSelect(render);
    }



    public highlight(render=false) {
        this.edges.forEach((e:EdgeAbstract) => {
           if (e.constructor !== EdgeResourceTag)
               return;
            (<EdgeResourceTag>e).getTagNode().highlight(render);

        });
        super.highlight(render)
    }


    public deHighlight(render=false) {
        this.edges.forEach((e:EdgeAbstract) => {
            if (e.constructor !== EdgeResourceTag)
                return;
            (<EdgeResourceTag>e).getTagNode().deHighlight(render);
        });
        super.deHighlight(render)
    }


    public setIsVisible(val) {

        super.setIsVisible(val);
    }
}