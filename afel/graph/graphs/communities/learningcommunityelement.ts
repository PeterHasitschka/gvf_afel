import {Plane} from "../../../../gvfcore/components/plane/plane";
import {CommunityElementAbstract} from "./communityelementabstract";
import {LearningCommunity} from "../../data/communities/learningCommunity";
import {GraphVisConfig} from "../../../../gvfcore/components/graphvis/config";
/**
 * A learning community vis element
 * @author Peter Hasitschka
 */
export class LearningCommunityElement extends CommunityElementAbstract {

    protected color = GraphVisConfig.graphelements['learningcommunity'].color;
    public static dataType = LearningCommunity;

    constructor(x:number, y:number, protected dataEntity:LearningCommunity, plane:Plane, options) {
        super(x, y, dataEntity, plane, options);
        this.setColor(this.color);
    }
}


