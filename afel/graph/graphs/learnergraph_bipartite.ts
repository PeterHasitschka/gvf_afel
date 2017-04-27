import {GraphAbstract} from "../../../gvfcore/components/graphvis/graphs/graphabstract";
import {Resource} from "../data/resource";
import {EdgeAbstract} from "../../../gvfcore/components/graphvis/graphs/edges/edgeelementabstract";
import {Plane} from "../../../gvfcore/components/plane/plane";
import {AfelData} from "../../afeldata";
import {NodeResource} from "./nodes/resource";
import {GraphLayoutFdl} from "../../../gvfcore/components/graphvis/graphs/layouts/graphlayoutfdl";
import {InterGraphEventService, INTERGRAPH_EVENTS} from "../../../gvfcore/services/intergraphevents.service";
import {NodeLearner} from "./nodes/learner";
import {Learner} from "../data/learner";
import {UiService} from "../../../gvfcore/services/ui.service";
import {LearningActivity} from "../data/connections/learningactivity";
import {GraphVisConfig} from "../../../gvfcore/components/graphvis/config";
import {EdgeResource} from "./edges/resource";
import {GvfCoreModule} from "../../../gvfcore/gvfcore.module";
import {GraphAutoCreateAbstract} from "../../../gvfcore/components/graphvis/graphs/graphautocreateabstract";
import {GraphBipartiteProjectionAbstract} from "../../../gvfcore/components/graphvis/graphs/graphbipartiteprojectionabstract";
import {Activity} from "../data/connections/activity";
import {EdgeLearnersLearning} from "./edges/learnerlearning";

/**
 * @author Peter Hasitschka
 */
export class LearnerGraphBPProj extends GraphBipartiteProjectionAbstract {

    protected data:Learner[];
    protected edges:EdgeAbstract[];
    protected weightLimit = 5;

    constructor(protected plane:Plane) {
        super(plane);


        this.nodetype = NodeLearner;
        this.bipartiteEdgeType = EdgeLearnersLearning;
        this.layoutClass = GraphLayoutFdl;

    }

    protected getPrimaryData():Learner[] {
        return AfelData.getInstance().getLearners();
    }

    protected getSecondaryData():Resource[] {
        return AfelData.getInstance().getResources();
    }

    protected getConnectionsData():LearningActivity[] {
        let ret = [];
        AfelData.getInstance().getActivities().forEach((a:Activity) => {
            if (a.constructor === LearningActivity)
                ret.push(a);
        });
        return <LearningActivity[]>ret;
    }

    /**
     * Adding event listeners for hovered and un-hovered learner(!) graphelements but also for same graphelements
     */
    protected addEventListeners() {

        super.addEventListeners();

        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.NODE_HOVERED, function (e) {
            let node:NodeResource = e.detail;
            if (node.name !== NodeResource.IDENTIFIER)
                return;

            let affectedLearners:Learner[] = Learner.getLearnersByResource(<Resource>node.getDataEntity());
            affectedLearners.forEach((l:Learner) => {
                let affectedLearnerNodes = this.getNodeByDataEntity(l);

                affectedLearnerNodes.forEach((n:NodeLearner) => {
                    n.highlight();
                })
            });
            this.plane.getGraphScene().render();
        }.bind(this));

        InterGraphEventService.getInstance().addListener(INTERGRAPH_EVENTS.NODE_LEFT, function (e) {
            let node:NodeResource = e.detail;
            if (node.name !== NodeResource.IDENTIFIER)
                return;

            this.graphElements.forEach((n:NodeLearner) => {
                n.deHighlight();
            });
            this.plane.getGraphScene().render();
        }.bind(this));
    }


    public init():void {
        super.init();
    }
}
