import {Plane} from "../../../../gvfcore/components/plane/plane";
import {CommunityElementAbstract} from "./communityelementabstract";
import {LearningCommunity} from "../../data/communities/learningCommunity";
import {GraphVisConfig} from "../../../../gvfcore/components/graphvis/config";
import {NodeLearner} from "../nodes/learner";
/**
 * A learning community vis element
 * @author Peter Hasitschka
 */
export class CommunicationCommunityElement extends CommunityElementAbstract {

    protected color = GraphVisConfig.graphelements['communicationcommunity'].color;
    protected highlightColor = GraphVisConfig.graphelements['communicationcommunity'].highlight_color;
    public static dataType = LearningCommunity;

    constructor(x:number, y:number, protected dataEntity:LearningCommunity, plane:Plane, options:Object) {
        super(x, y, dataEntity, plane, options);

        this.setColor(this.color);
    }
}


