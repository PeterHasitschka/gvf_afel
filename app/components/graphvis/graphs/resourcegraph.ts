import {Plane} from '../../plane/plane';
import {GraphAbstract} from './abstract';
import {Resource} from '../data/resource';
import {DataService} from '../../../services/data.service';

import {NodeResource} from './nodes/resource';

import {GraphLayoutRandom} from './layouts/random';
import {EdgeBasic} from "./edges/basic";
import {Activity} from "../data/activity";
import {EdgeAbstract} from "./edges/abstract";
import {NodeAbstract} from "./nodes/abstract";


/**
 * The resource graph shows relations between Learning-Resources
 * Thus its Data consists of @see{Resource} data objects.
 * @author Peter Hasitschka
 */
export class ResourceGraph extends GraphAbstract {

    protected data:Resource[];
    protected edges:EdgeAbstract[];

    constructor(protected plane:Plane) {
        super(plane);

        this.dataGetterMethod = DataService.getInstance().getResources.bind(DataService.getInstance());

        this.nodetype = NodeResource;
        this.layout = GraphLayoutRandom;
    }

    /**
     * Init method. Super class calls loadData()
     * After loading data the afterLoad callback is called
     */
    public init():void {
        super.init();
        this.connectResources();
    }


    private connectResources() {
        var dim = this.plane.calculateCanvasSize();

        let activities = DataService.getInstance().getActivities();

        let learnings = {};
        activities.forEach((activity:Activity) => {
            if (activity.getType() !== Activity.TYPE_LEARNING)
                return;
            let rId = activity.getData('resource_id');
            let lId = activity.getData('learner_id');
            if (typeof learnings[lId] == 'undefined')
                learnings[lId] = [];
            learnings[lId].push(rId);
        });

        for (let lKey in learnings) {
            if (learnings[lKey].length < 2)
                continue;

            learnings[lKey].forEach((rKey:number, i) => {

                if (i < learnings[lKey].length - 1) {
                    let n1:NodeAbstract = this.getNodeByDataId(rKey);
                    let n2:NodeAbstract = this.getNodeByDataId(learnings[lKey][i + 1]);

                    let resourceConnection = new EdgeBasic(
                        n1.getPosition().x,
                        n1.getPosition().y,
                        n2.getPosition().x,
                        n2.getPosition().y);

                    this.plane.getGraphScene().getThreeScene().add(resourceConnection);
                }
            });

        }

        this.plane.getGraphScene().render();
    }
}